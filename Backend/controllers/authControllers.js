console.log("✅ authControllers.js LOADED");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");
const nodemailer = require("nodemailer");
const generateUserID = require("../utils/generateUserID");
const { generateOTP } = require("../utils/generateOTP");
const { welcomeEmail, forgotPasswordOTPEmail } = require("../utils/emailTemplate");
require('dotenv').config();
const otpStore = {};
const passwordResetAllowed = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const tables = [
    { table: "RM_SDB_Admins", role: "admin" },
    { table: "RM_SDB_Employee", role: "employee" },
    { table: "RM_SDB_Students", role: "student" },
    { table: "RM_SDB_Master", role: "SuperUser" },
  ];

  try {
    for (const t of tables) {
      const { data, error } = await supabase
        .from(t.table)
        .select("*")
        .eq("email", email)
        .limit(1);

      if (error) {
        console.error(`Error in ${t.table}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        const user = data[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.json({
            success: false,
            message: "Incorrect password",
          });
        }

        const token = jwt.sign(
          {
            user_id: user.user_id,
            id : user.id,
            role: t.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h'
          }
        )
        
        return res.json({
          success: true,
          role: t.role,
          token,
          user: {
            id : user.id,
            user_id: user.user_id,
            name: user.name,
            email: user.email,
          },
        });
      }
    }
    
    return res.json({
      success: false,
      message: "User not found",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


exports.forgotPassword = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.json({ success: false, message: "ID is required." });
  }

  const tables = [
    { table: "RM_SDB_Admins", role: "admin" },
    { table: "RM_SDB_Master", role: "SuperUser" },
    { table: "RM_SDB_Employee", role: "employee" },
    { table: "RM_SDB_Students", role: "student" }
  ];

  try {
    for (const t of tables) {
      const { data, error } = await supabase
        .from(t.table)
        .select("id, user_id, name, email")
        .eq("user_id", user_id);


      if (error) {
        console.error(error);
        continue;
      }

      if (data && data.length > 0) {
        const user = data[0];
  
        const otp = generateOTP();

        otpStore[user_id] = {
          otp,
          expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
        };

        await transporter.sendMail({
          from: `"School Management" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Password Reset OTP",
          html: forgotPasswordOTPEmail(user.name, otp)
        });

        return res.json({
          success: true,
          message: "OTP sent to registered email"
        });
      }
    }

    return res.json({
      success: false,
      message: "User ID was not found."
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


exports.verifyOTP = (req, res) => {
  const { user_id, otp } = req.body;

  const saved = otpStore[user_id];

  if (!saved) {
    return res.json({
      success: false,
      message: "OTP expired unsaved wala"
    });
  }

  if (Date.now() > saved.expiresAt) {
    delete otpStore[user_id];
    return res.json({
      success: false,
      message: "OTP expired time waala"
    });
  }

  if (saved.otp != otp) {
    return res.json({
      success: false,
      message: "Invalid OTP"
    });
  }

  delete otpStore[user_id];

  passwordResetAllowed[user_id] = true;

  return res.json({
    success: true,
    message: "OTP verified"
  });
};

exports.resetPass = async (req, res) => {
  const { user_id, newPass } = req.body;

  if (!passwordResetAllowed[user_id]) {
    return res.json({
      success: false,
      message: "OTP verification failed."
    });
  }

  const hashedPass = await bcrypt.hash(newPass, 10);

  const tables = ["RM_SDB_Students", "RM_SDB_Employee", "RM_SDB_Admins", "RM_SDB_Master"];
  let updated = false;

  for (const t of tables) {
    const { data, error } = await supabase
      .from(t)
      .update({ password: hashedPass })
      .eq("user_id", user_id)
      .select("id");

    if (error) continue;

    if (data && data.length > 0) {
      updated = true;
      break;
    }
  }

  delete passwordResetAllowed[user_id];

  if (!updated) {
    return res.json({
      success: false,
      message: "User not found"
    });
  }

  return res.json({
    success: true,
    message: "Password changed successfully"
  });
};


exports.createUser = async (req, res) => {
  const { name, email, role, std_class } = req.body;

  if (!name || !email || !role) {
    return res.json({
      success: false,
      message: "All fields are required!",
    });
  }
  try {
    // Student Logic

    if (role === "student") {
      const { data: students } = await supabase
        .from("RM_SDB_Master")
        .select("*")
        .eq("email", email)
        .eq("role", role);

      const stdNoID = students?.find((s) => !s.user_id);

      if (stdNoID) {
        const user_id = await generateUserID({
          name,
          role: "student",
          std_class,
        });

        await supabase
          .from("RM_SDB_Master")
          .update({ user_id })
          .eq("id", stdNoID.id);

        return res.json({
          success: true,
          message: "Student ID generated and Updated",
          user_id,
        });
      }
      // Generate user_id for new student
      const user_id = await generateUserID({
        name,
        role: "student",
        std_class,
      });

      const { data, error } = await supabase.from("RM_SDB_Master").insert([
        {
          name,
          role,
          email,
          user_id,
          std_class,
        },
      ]);

      if (error) {
        console.error("Insert failed:", error);
        return res.json({
          success: false,
          message: "Failed to create student",
          error,
        });
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to School Management System",
        html: welcomeEmail(name, role, user_id),
      });

      return res.json({
        success: true,
        message: "Student created",
        user_id,
      });
    }

    if (role === "employee") {
      const { data: existingEMP } = await supabase
        .from("RM_SDB_Master")
        .select("id")
        .eq("email", email)
        .eq("role", "employee")
        .maybeSingle();

      if (existingEMP) {
        return res.json({
          success: false,
          message: "Employee already exists.",
        });
      }
      const user_id = await generateUserID({ role: "employee" });
      await supabase.from("RM_SDB_Master").insert([
        {
          name,
          role,
          email,
          user_id,
        },
      ]);

      await transporter.sendMail({
        from: `"School Management" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to School Management System",
        html: welcomeEmail(name, role, user_id),
      });

      return res.json({
        success: true,
        message: "Employee created",
        user_id,
      });
    }
  } catch (err) {
    console.error("Server Error : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error Occurred",
    });
  }
};

exports.registerUser = async (req, res) => {
  const { name, user_id, email, password, phone } = req.body;

  if (!name || !user_id || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  try {
    // Check enrollment
    const { data: isEnrolled, error: enrollError } = await supabase
      .from("RM_SDB_Master")
      .select('id, email, std_class')
      .eq("user_id", user_id)
      .eq("email", email)
      .maybeSingle();

    if (enrollError) throw enrollError;

    if (!isEnrolled) {
      return res.json({
        success: false,
        message: "User is not enrolled",
      });
    }

    // Detect role
    const role = user_id[0].toUpperCase() === "S" ? "student" : "employee";
    console.log("Detected role:", role);

    // ================= STUDENT =================
    if (role === "student") {
      const { data: existingStd, error: stdError } = await supabase
        .from("RM_SDB_Students")
        .select("user_id")
        .eq("user_id", user_id);

      if (stdError) throw stdError;

      if (existingStd?.length > 0) {
        return res.json({
          success: false,
          message: "Student already exists, please login.",
        });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("RM_SDB_Students")
        .insert([{
          name,
          user_id,
          email,
          password: hashedPass,
          phone,
          std_class: isEnrolled.std_class
        }]);

      if (error) throw error;

      return res.json({
        success: true,
        message: "Student registered successfully",
        data,
      });
    }

    // ================= EMPLOYEE =================
    if (role === "employee") {
      const { data: existingEmp, error: empError } = await supabase
        .from("RM_SDB_Employee")
        .select("user_id")
        .eq("user_id", user_id);

      if (empError) {
        throw empError;
      }

      if (existingEmp.length > 0) {
        return res.json({
          success: false,
          message: "Employee already exists, please login.",
        });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("RM_SDB_Employee")
        .insert([{
          name,
          user_id,
          email,
          password: hashedPass,
          phone,
        }]);

      if (error) {
        throw error;
      }
      return res.json({
        success: true,
        message: "Employee registered successfully",
        data,
      });
    }

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error occurred",
    });
  }
};


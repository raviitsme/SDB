require('dotenv').config();
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');
const { studentAddedByTeacherEmail } = require('../utils/emailTemplate');
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})

exports.getEmployeeData = async (req, res) => {
    try {
        const { user_id } = req.user;

        const { data, error } = await supabase
            .from("RM_SDB_Employee")
            .select("id, name, user_id, email, phone")
            .eq("user_id", user_id)
            .single();

        if (error) {
            console.error("Error occurred:", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch employee data",
            });
        }

        return res.json({
            success: true,
            message: "Employee fetched successfully",
            data,
        });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({
            success: false,
            message: "Server failure",
        });
    }
}

exports.getMyStudents = async (req, res) => {
    try {
        const { user_id } = req.user;

        const { data : employee, error } = await supabase
        .from("RM_SDB_Employee")
        .select("id, user_id")
        .eq('user_id', user_id)
     
        if(employee?.length > 0) {
            const EMP = employee[0];

            const { data : students, error } = await supabase 
            .from("RM_SDB_Students")
            .select("id, name, std_class, user_id, email, phone")
            .eq("teacher_id", EMP.id)

            if(error) {
                console.log("Error fetching students : ", error);
                return res.json({
                    success : false,
                    message : "Failed to fetch students."
                });
            }

            return res.json({
                success : true,
                message : "Students fetched successfully.",
                students
            });
        }
        return res.json({
            success : false,
            message : "Failed to fetch employee."
        });
    } catch (err) { 
        console.error("Error : ", err)
    }
}

exports.addStudents = async (req, res) => {
  const { user_id, name, phone, email, std_class } = req.body;

  // Validate required fields
  if (!user_id || !name || !phone || !email || !std_class) {
    return res.json({
      success: false,
      message: "All fields are required."
    });
  }

  const teacher_id  = req.user.user_id; // middleware se teacher ka user_id

  try {
    // Get teacher BIGINT id
    const { data: teacher, error: teacherError } = await supabase
      .from("RM_SDB_Employee")
      .select("id")
      .eq("user_id", teacher_id)
      .single();

    if (teacherError || !teacher) {
        console.log(teacherError)
      return res.json({
        success: false,
        message: "No teacher found."
      });
    }

    // Check in Master table first
    const { data: masterStudent, error: masterError } = await supabase
      .from("RM_SDB_Master")
      .select("user_id")
      .eq("user_id", user_id)
      .single();

    if (masterError || !masterStudent) {
      return res.json({
        success: false,
        message: "Student not found in Master table."
      });
    }

    // Check if student already exists
    const { data: existingStudent, error: studentError } = await supabase
      .from("RM_SDB_Students")
      .select("id")
      .eq("user_id", user_id);

    if (studentError) {
      console.error(studentError);
      return res.json({
        success: false,
        message: "Error checking existing student."
      });
    }

    if (existingStudent?.length > 0) {
      return res.json({
        success: false,
        message: "Student already exists."
      });
    }

    // Insert student
    const { error: insertError } = await supabase
      .from("RM_SDB_Students")
      .insert([
        {
          user_id,
          name,
          phone,
          email,
          std_class,
          teacher_id: teacher.id
        }
      ]);

    if (insertError) {
      console.error(insertError);
      return res.json({
        success: false,
        message: "Error inserting student."
      });
    }

    await transporter.sendMail({
        from : `School Management ${process.env.EMAIL_PASS}`,
        to : email,
        subject : "Update your password",
        html : studentAddedByTeacherEmail(name, user_id)
    });

    // Success
    return res.json({
      success: true,
      message: "Student added successfully."
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.json({
      success: false,
      message: "Server failure."
    });
  }
};

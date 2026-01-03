const express = require("express");
const cors = require("cors");
// const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const supabase = require('./config/supabase')
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superUserRoutes = require("./routes/superUserRoutes");
const studentRoutes = require('./routes/studentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
require("dotenv").config();

const app = express();

// CORS
app.use(
  cors({
    origin: ["sdb-7lm.pages.dev"],
    credentials : true
  })
);

// JSON body parsing
app.use(express.json());

// -----------------------------
// ROOT
// -----------------------------
app.get("/", (req, res) => {
  res.send("Backend running....");
});


app.get('/insert-test-admin', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash("helloravi@123", 10);
    const { data, error } = await supabase
      .from('RM_SDB_Admins')
      .insert([
        {
          user_id : "ADMN2025001",
          name: "Ravi Mohan",
          email: "its.raviohan01@gmail.com",
          password: hashedPass,
          phone: 9450866157
        }
      ]);
    if (error) {
      console.log("Error hua : ", error);
      return res.json({
        success: false,
        message: "Error inserting admin!"
      });
    }
    return res.json({
      success: true,
      message: "Admin inserted successfully"
    })
  } catch (err) {
    console.error("Error : ", err)
    return res.json({
      success: false,
      message: "Error inserting admin!"
    })
  }
});

app.delete('/deleteAdmin', async (req, res) => {
  try {
    const { email } = 'testhaiyaar@gmail.com'; // get email from request

    const { data, error } = await supabase
      .from("RM_SDB_Admins")
      .delete()
      .eq('email', email);

    if (error) {
      console.log("Error : ", error);
      return res.json({
        success: false,
        message: "Error connecting to database"
      });
    }

    return res.json({
      success: true,
      message: "Admin deleted successfully",
      data: data
    });

  } catch (err) {
    console.error("Error : ", err)
    return res.json({
      success: false,
      message: "Error deleting admin!"
    });
  }
});


// app.get("/test-insert", async (req, res) => {
//     const hashedPass = await bcrypt.hash("helloravi@123", 10)
//     const { data, error } = await supabase
//     .from("RM_SDB_Master")
//     .insert([
//       { 
//         full_name: "Ravi Mohan",
//         email: "prataprudra751@gmail.com", 
//         password: hashedPass,
//         role: 'Super User'
//      },
//     ]);
//   if (error) {
//     return res.status(400).json({ error });
//   } else {
//     res.json({ message: "Inserted Successfully!", data });
//   }
// });

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth : {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },

// })

// app.get('/send-test-email', async(req, res) => {
//   try {
//     await transporter.sendMail({
//       from : process.env.EMAIL_USER,
//       to : 'prataprudra751@gmail.com',
//       subject : "This is a test Email sent from backend!",
//       text : "Hello from Express server.js backend"
//     })

//     res.json({
//       success : true,
//       message : "Email sent Successfully!"
//     })
//   } catch (err) {
//     console.error("Server Error : ", err);
//     return res.json({
//       success : false,
//       message: "Internal Server Error Occurred!"
//     })
//   }
// })

app.get('/getdata', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("RM_SDB_Master")
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch count"
      });
    }

    return res.status(200).json({
      success: true,
      counts: {
        master: count
      }
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

// Authentication Routes
app.use("/auth", authRoutes);

// Dashboard data, Fetch, delete : admins, Teachers
app.use("/management", adminRoutes);

// SuperUser Routes
app.use("/superUser", superUserRoutes);

// Employee Routes
app.use('/employee', employeeRoutes);

// Student Routes
app.use('/student', studentRoutes);

// -----------------------------
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000!");
});

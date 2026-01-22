const supabase = require("../config/supabase");
const generateAdminID = require("../utils/generateAdminID");
const nodemailer = require('nodemailer');
require('dotenv').config();
const { adminWelcome } = require('../utils/emailTemplate');
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

// Fetch Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const { count: adminCount, error: adminErr } = await supabase
            .from('RM_SDB_Admins')
            .select('id', { count: "exact", head: true })

        const { count: employeeCount, error: employeeErr } = await supabase
            .from('RM_SDB_Employee')
            .select('id', { count: "exact", head: true })

        const { count: studentCount, error: studentErr } = await supabase
            .from('RM_SDB_Students')
            .select('id', { count: "exact", head: true })

        if (adminErr || employeeErr || studentErr) {
            return res.status(500).json({ success: false });
        }

        return res.json({
            success: true,
            counts: {
                admins: adminCount,
                employees: employeeCount,
                students: studentCount
            }
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(400).json({
            success: false,
            message: "Failed to get details"
        })
    }
}

// Fetch Admins
exports.getAdmins = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("RM_SDB_Admins")
            .select("id, user_id, name, email, phone");

        if (error) {
            console.error("Error fetching data from server.", error.message);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch admins"
            });
        } else {
            return res.status(200).json({
                success: true,
                admins: data
            });
        }
    } catch (err) {
        console.error("Server error : ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

// Add Admins
exports.addAdmins = async (req, res) => {
    const { name, email, phone } = req.body;
    console.log("Yaha aaya")
    if (!name || !email || !phone) {
        return res.json({
            success: false,
            message: 'All fields are required!'
        });
    }
    try {
        const { data: isExisting, error } = await supabase
            .from("RM_SDB_Admins")
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (isExisting) {
            console.log("Admin already exists.", isExisting);
            return res.json({
                success: false,
                message: "Admin already exists."
            });
        }
        if (error) {
            console.log(error);
            return res.json({
                success: false,
                message: "Error in Supabase"
            });
        }
        const adminID = await generateAdminID();
        const { data, error:insertError } = await supabase
            .from("RM_SDB_Admins")
            .insert([
                {
                    name,
                    email,
                    phone,
                    user_id: adminID
                }
            ])

        if (insertError) {
            console.log("Error inserting Admin", insertError);
            return res.json({
                success: false,
                message: "Failed to insert admin"
            });
        }
        console.log("Insert Data : ", data);
        await transporter.sendMail({
            from : `School Management <${process.env.EMAIL_USER}`,
            to : email,
            subject : "Admin Registeration Welcome",
            html : adminWelcome(name, adminID)
        });
        return res.status(201).json({
            success: true,
            message: "Admin added successfully",
            admin_id: adminID
        });


    } catch (err) {
        console.error(err);
        return res.json({
            success: false,
            message: "Server Error"
        });
    }
}

// Delete Admins
exports.deleteAdmins = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInAdminID = req.user.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch admin ID"
            });
        }

        if (parseInt(id) === parseInt(loggedInAdminID)) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const { error } = await supabase
            .from("RM_SDB_Admins")
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success: false,
                message: "Error fetching admins"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred!"
        })
    }
}

// Fetch Employees
exports.getEmployees = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("RM_SDB_Employee")
            .select('id, user_id, name, email, phone')
            .order('id', { ascending : true })    

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success: false,
                message: 'Error Fetching Teachers'
            });
        }

        return res.status(200).json({
            success: true,
            employees: data
        });
    } catch (err) {
        console.error('Error : ', err);
        return res.status(500).json({
            success: false,
            message: "Error occurred."
        })
    }
}

// Add Employees
exports.editEmployees = async (req, res) => {
    const { name, email, phone, assignedClass } = req.body; 
    const { id } = req.params;

    try {
        if(!id) {
            return res.status(400).json({
                success : false,
                message : "Failed to fetch Employee ID"
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (assignedClass) updateData.teaching_class = assignedClass;

        if(email) {
            const { data, error } = await supabase
            .from('RM_SDB_Employee')
            .select('id')
            .eq('email', email)
            .neq('id', id)
            .maybeSingle()
            
            if(error) {
                console.log("Error checking email : ", error);
                return res.json({
                    success : false,
                    message : "Email check failure"
                });
            }

            if(data) {
                return res.status(500).json({
                    success : false,
                    message : "Email already exists"
                });
            }
        }
        const { error:updateError } = await supabase
        .from('RM_SDB_Employee')
        .update(updateData)
        .eq('id', id)
        
        if(updateError) {
            console.log("Update Error : ", updateError);
            return res.status(500).json({
                success : false,
                message : "Data updation failed"
            })
        }
        
        return res.status(200).json({
            success : true,
            message : "Employee edited successfully."
        });
    } catch (err) {
        console.log("Error : ", err);
        return res.status(500).json({
            success : false,
            message : "Server Error!"
        });
    }
}

// Delete Employees
exports.deleteTeachers = async (req, res) => {

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch Employee ID"
            });
        }

        const { error } = await supabase
            .from("RM_SDB_Employee")
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success: false,
                message: "Error fetching Employee"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred!"
        })
    }
}

// Fetch Students
exports.getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("RM_SDB_Students")
            .select('id, user_id, name, email, phone');

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success: false,
                message: 'Error Fetching Students'
            });
        }

        return res.status(200).json({
            success: true,
            students: data
        });
    } catch (err) {
        console.error('Error : ', err);
        return res.status(500).json({
            success: false,
            message: "Error occurred."
        })
    }
}

// Delete Students
exports.deleteStudents = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch Student ID"
            });
        }

        const { error } = await supabase
            .from("RM_SDB_Students")
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success: false,
                message: "Error fetching Students"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred!"
        })
    }
}

// exports.addAdmin = async (req, res) => {
//     const { name, email, phone } = req.body;

//     try {
//         const { data, error } = await supabase
//         .from("RM_SDB_Admins")
//         .select('id')
//         .maybeSingle()

//         if(error) {
//             console.log("Supabase error : ", error);
//             return res.json({
//                 success : false,
//                 message : "No user found!"
//             })
//         }

//     }

// }
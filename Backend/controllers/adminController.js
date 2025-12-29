const supabase = require("../config/supabase");

// Fetch Dashboard Data
exports.getDashboardData = async(req, res) => {
    try {
        const { count : adminCount, error : adminErr } = await supabase
        .from('RM_SDB_Admins')
        .select('id', { count : "exact", head : true })

        const { count : employeeCount, error : employeeErr } = await supabase
        .from('RM_SDB_Employee')
        .select('id', { count : "exact", head : true })
        
        const { count : studentCount, error : studentErr } = await supabase
        .from('RM_SDB_Students')
        .select('id', { count : "exact", head : true })

        if(adminErr || employeeErr || studentErr) {
            return res.status(500).json({ success : false });
        }

        return res.json({
            success : true,
            counts : {
                admins : adminCount,
                employees : employeeCount,
                students : studentCount
            }
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(400).json({
            success : false,
            message : "Failed to get details"
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

// Delete Admins
exports.deleteAdmins = async(req, res) => {
    try {
        const { id } = req.params;
        const loggedInAdminID = req.user.id;

        if(!id) {
            return res.status(400).json({
                success : false,
                message : "Failed to fetch admin ID"
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
                success : false,
                message : "Error fetching admins"
            });            
        }

        return res.status(200).json({
            success : true,
            message : "Admin deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success : false,
            message : "Server Error Occurred!"
        })
    }
}

// Fetch Employees
exports.getEmployees = async (req, res) => {
    try {
        const { data, error } = await supabase
        .from("RM_SDB_Employee")
        .select('id, user_id, name, email, phone');

        if(error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success : false,
                message : 'Error Fetching Teachers'
            });
        }

        return res.status(200).json({
            success : true,
            employees : data
        });
    } catch (err) {
        console.error('Error : ',err);
        return res.status(500).json({
            success :false,
            message : "Error occurred."
        })
    }
}

// Delete Employees
exports.deleteTeachers = async(req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                success : false,
                message : "Failed to fetch Employee ID"
            });
        }

        const { error } = await supabase
        .from("RM_SDB_Employee")
        .delete()
        .eq('id', id)

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success : false,
                message : "Error fetching Employee"
            });            
        }

        return res.status(200).json({
            success : true,
            message : "Employee deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success : false,
            message : "Server Error Occurred!"
        })
    }
}

// Fetch Students
exports.getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
        .from("RM_SDB_Students")
        .select('id, user_id, name, email, phone');

        if(error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success : false,
                message : 'Error Fetching Students'
            });
        }

        return res.status(200).json({
            success : true,
            students : data
        });
    } catch (err) {
        console.error('Error : ',err);
        return res.status(500).json({
            success :false,
            message : "Error occurred."
        })
    }
}

// Delete Students
exports.deleteStudents = async(req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                success : false,
                message : "Failed to fetch Student ID"
            });
        }

        const { error } = await supabase
        .from("RM_SDB_Students")
        .delete()
        .eq('id', id)

        if (error) {
            console.error("Error : ", error);
            return res.status(500).json({
                success : false,
                message : "Error fetching Students"
            });            
        }

        return res.status(200).json({
            success : true,
            message : "Student deleted successfully!"
        });
    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success : false,
            message : "Server Error Occurred!"
        })
    }
}

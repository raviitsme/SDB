const supabase = require("../config/supabase");

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

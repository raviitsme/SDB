const supabase = require("../config/supabase");

exports.getStudentData = async (req, res) => {
  try {
    const { user_id } = req.user;

    const { data, error } = await supabase
      .from("RM_SDB_Students")
      .select("name, user_id, std_class, email, phone")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.error("Error occurred:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch student data",
      });
    }

    return res.json({
      success: true,
      message: "Student fetched successfully",
      data,
    });
    
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { user_id } = req.user;

    const { data, error } = await supabase
    .from("RM_SDB_Attendance")
    .select('id, subject, present, total')
    .eq('student_user_id', user_id)

    if(error) {
      return res.json({
        success : false,
        message : "Error Fetching Attendance"
      });
    }

    return res.json({
      success : true,
      message : "Attendance fetched successfully",
      attendances : data
    });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({
      success : false,
      message : "Server Error."
    });
  }
}
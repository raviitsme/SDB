const supabase = require('../config/supabase');

async function generateAdminID() {
    const year = new Date().getFullYear();
    const prefix = 'ADMIN';
    const pattern = `${prefix}${year}%`;

    const { data, error } = await supabase
    .from('RM_SDB_Admins')
    .select('id, user_id')
    .like('user_id', pattern)
    .order('user_id', { ascending : false })
    .limit(1)

    if(error) {
        console.log("ID Generation failed : ", error);
        return;
    }
    
    let nextNum = 1;

    if(data?.length > 0) {
        nextNum = parseInt(data[0].user_id.slice(-3)) + 1;
    }

    return `${prefix}${year}${String(nextNum).padStart(3, "0")}`;
}

module.exports = generateAdminID;
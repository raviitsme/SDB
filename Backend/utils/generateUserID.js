const supabase = require('../config/supabase')

async function generateUserID({ name, std_class, role }) {
    const year = new Date().getFullYear();
    let prefix, section, baseID = "";

    if (role === "student") {
        prefix = "ST";
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
        section = alpha.includes(name[0].toLowerCase()) ? "A" : "B";
        baseID = `${prefix}${year}${std_class}${section}`;
    }
    else if (role === "employee") {
        prefix = "EMP";
        baseID = `${prefix}${year}`;
    }
    else {
        console.log("Role : " ,role);
        throw new Error("Invalid role");
    }

    const pattern = `${baseID}%`;

    const { data, error } = await supabase
        .from('RM_SDB_Master')
        .select('user_id')
        .like('user_id', pattern)
        .order('user_id', { ascending: false })
        .limit(1)

    if (error) {
        throw new Error("ID generation failed!")
    }

    let nextNum = 1;

    if(data?.length > 0) {
        nextNum = parseInt(data[0].user_id.slice(-3)) + 1
    }

    return `${baseID}${String(nextNum).padStart(3, "0")}`;
}

module.exports = generateUserID;
const { supabase } = require("./supabase");


async function getUserById(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) throw new Error(error.message);

    return data;
}


module.exports = {
    getUserById
}
import { supabase } from "./supabase";


export async function uploadProfilePicture(file: File, id: string) {
    const filePath = `${id}/avatar_${Date.now()}.${file.name.split('.').pop()}`;

    // Upload du fichier
    const { error } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error("Erreur d'upload: ", error.message);
        return null;
    }

    // Récupération de l'URL publique
    const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

    return data.publicUrl;
}


export async function updateProfilePicture(id: string, url: string) {
    const { error } = await supabase
        .from('users')
        .update({ pfp: url })
        .eq('id', id);

    if (error) {
        console.error("Erreur de mise à jour: ", error.message);
    }
}


export async function uploadHeaderBgImage(id: string, file: File) {
    const fileName = `${id}/header_${Date.now()}.${file.name.split('.').pop()}`;

    const { data, error } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });

    if (error) throw error;


    const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}


export async function updateHeaderBgImage(id: string, url: string) {
    const { error } = await supabase
        .from('users')
        .update({ "header_bg": url })
        .eq('id', id);

    if (error) {
        console.error("Erreur de mise à jour: ", error.message);
    }
}
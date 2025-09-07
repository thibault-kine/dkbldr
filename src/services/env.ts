export async function loadEnv() {
    const res = await fetch("/env/", {
        method: "GET"
    });
    const data = await res.json();
    console.log(data);
    
    return data;
}

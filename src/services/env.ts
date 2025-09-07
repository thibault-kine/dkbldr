export async function loadEnv() {
  const res = await fetch("https://dkbldr-api.up.railway.app/api/env"); // si ton back est sur le même domaine
  const data = await res.json();
  return data;
}

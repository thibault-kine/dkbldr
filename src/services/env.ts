export async function loadEnv() {
  const res = await fetch("/env"); // si ton back est sur le même domaine
  const data = await res.json();
  return data;
}

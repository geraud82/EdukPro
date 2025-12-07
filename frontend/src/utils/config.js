// ===============================
// API CONFIGURATION – EDUCKPRO
// ===============================

// 1️⃣ Lecture de la variable d’environnement Vite
// Vercel → VITE_API_URL est injectée au build
// Local → .env est lu automatiquement
const ENV_API_URL = import.meta.env.VITE_API_URL;

// 2️⃣ Fallback automatique si la variable n'est pas chargée
export const API_URL = ENV_API_URL || "https://edukpro.onrender.com";

// 3️⃣ Endpoints centralisés
export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  profile: `${API_URL}/api/profile`,

  // Notifications Push
  vapidPublicKey: `${API_URL}/api/push/vapid-public-key`,
  pushSubscribe: `${API_URL}/api/push/subscribe`,
  pushUnsubscribe: `${API_URL}/api/push/unsubscribe`,
};

// 4️⃣ Log de debug (ne s'affiche qu'en dev)
if (import.meta.env.DEV) {
  console.log("🔧 API_URL chargé :", API_URL);
}

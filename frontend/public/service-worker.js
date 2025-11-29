// Kill old service worker
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => {
  clients.matchAll({ type: "window" }).then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
});

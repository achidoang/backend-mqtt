let clients = [];

// Fungsi untuk menambahkan klien baru
function addClient(ws) {
  clients.push(ws);
}

// Fungsi untuk menghapus klien yang terputus
function removeClient(ws) {
  clients = clients.filter((client) => client !== ws);
}

// Fungsi untuk broadcast data ke semua klien
function broadcastProfileUpdate(update) {
  const message = JSON.stringify(update);

  clients.forEach((client) => {
    if (client.readyState === 1) {
      // Cek jika koneksi WebSocket masih terbuka
      client.send(message);
    }
  });
}

// Inisialisasi WebSocket
function initializeWebSocketProfile(wss) {
  wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");
    addClient(ws);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      removeClient(ws);
    });
  });
}

module.exports = {
  initializeWebSocketProfile,
  broadcastProfileUpdate,
};

const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Configuración de Redis (usando el nombre del servicio en docker-compose)
const pubClient = createClient({ url: "redis://redis:6379" });
const subClient = pubClient.duplicate();

async function init() {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Adaptador de Redis conectado");
}

init();

const users = {}; 

io.on('connection', (socket) => {
    // El cliente debe enviar el tenant_id en el handshake o query
    const tenantId = socket.handshake.query.tenantId;
    const userId = socket.handshake.query.userId;

    if (tenantId) {
        // Aislamiento: El usuario solo escucha eventos de su clínica/tenant
        socket.join(`tenant_${tenantId}`);
        console.log(`User ${userId} unido a sala de Tenant: ${tenantId}`);
    }

    socket.on("user_connected", (data) => {
        users[data.user_id] = socket.id;
        // Notificar solo a los usuarios del mismo Tenant que alguien se conectó
        io.to(`tenant_${tenantId}`).emit('updateUserStatus', users);
    });

    socket.on('disconnect', () => {
        for (let id in users) {
            if (users[id] === socket.id) {
                delete users[id];
                break;
            }
        }
        io.to(`tenant_${tenantId}`).emit('updateUserStatus', users);
    });

    // Ejemplo de evento clínico con aislamiento de Tenant
    socket.on('sendNewNotificationToServer', (data) => {
        // .to() asegura que la notificación NO salga de la "burbuja" del tenant
        socket.to(`tenant_${tenantId}`).emit('sendNewNotificationToClient', data);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor Multi-tenant listo en puerto ${PORT}`);
});
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import { startMqttClient } from './src/mqtt/mqttClient';
import picoRoutes from './src/routes/picoRoutes';
import dataRoutes from './src/routes/dataRoutes';
import prisma from '../server/src/config/prisma';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected.");

    app.use(express.json());

    app.use('/api/pico', picoRoutes);
    app.use('/api/data', dataRoutes);

    io.on('connection', (socket) => {
      console.log('Client WebSocket connecté:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client WebSocket déconnecté:', socket.id);
      });
    });

    startMqttClient();

    server.listen(port, () => {
      console.log(`Backend sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();

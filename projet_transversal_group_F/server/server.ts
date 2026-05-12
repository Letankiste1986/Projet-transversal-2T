import express from 'express';
import 'dotenv/config';
import { startMqttClient } from './src/mqtt/mqttClient'
import picoRoutes from './src/routes/picoRoutes'
import dataRoutes from '../server/src/routes/dataRoutes'
import prisma from '../server/src/config/prisma'


const app = express()
const port = 3000

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected.");

    //Lance le client mqtt
    startMqttClient();

    app.listen(port, () => {
      console.log(`Backend sur http://localhost:${port}`)
    })
  }
  catch (error) {
    console.error("Unable to connect to the database:", error);
  };

  app.use(express.json());

  app.use('/api/pico/',picoRoutes);

  app.use('/api/data',dataRoutes);

}


startServer();

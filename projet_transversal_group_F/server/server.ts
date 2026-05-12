import express from 'express';
import 'dotenv/config';
import { startMqttClient } from './src/mqtt/mqttClient'
import picoRoutes from './src/routes/picoRoutes'

const app = express()
const port = 3000

app.use(express.json());
app.use(picoRoutes);

//Lance le client mqtt
startMqttClient();

app.listen(port, () => {
  console.log(`Backend sur http://localhost:${port}`)
})

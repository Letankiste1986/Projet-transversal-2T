import { Router, Request, Response } from 'express';
import { publishMqttMessage } from '../mqtt/mqttClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    await publishMqttMessage('maison/led', 'ON')
    return res.json({ message: 'Commande envoyée au Pico' })
  } catch (error) {
    console.error('Erreur envoi commande Pico:', error)
    return res.status(500).json({ error: 'Impossible d’envoyer la commande au Pico' })
  }
})

export default router

import mqtt from 'mqtt'
import { createMesureObject, parseSensorValue } from '../parser/parseMesure'
import prisma from '../config/prisma'
import { io } from '../../server';


let mqttClient: mqtt.MqttClient | null = null

async function saveMesure(temperature: number, humidite: number) {
    const createdMesure = await prisma.mesure.create({
        data: {
            temperature,
            humidite,
        },
    })

    console.log('Mesure enregistrée:', createdMesure)

    io.emit('new-mesure', createdMesure);
}

//Récupère les credentials du .env
export function startMqttClient() {
    const mqttUrl = process.env.MQTT_URL
    const mqttUsername = process.env.MQTT_USERNAME
    const mqttPassword = process.env.MQTT_PASSWORD
    const temperatureTopic = process.env.MQTT_TEMPERATURE_TOPIC || 'maison/tem'
    const humidityTopic = process.env.MQTT_HUMIDITY_TOPIC || 'maison/hum'
    const mqttTopics = [temperatureTopic, humidityTopic]
    let latestTemperature: number | null = null
    let latestHumidite: number | null = null

    //Vérifie que la route est pas vide
    if (!mqttUrl) {
        throw new Error('MQTT_URL manquant dans .env')
    }

    //Connexion au client mqtt
    const client = mqtt.connect(mqttUrl, {
        username: mqttUsername,
        password: mqttPassword,
    })
    mqttClient = client

    //Quand connexion réussie
    client.on('connect', () => {

        //affiche en console la réussite
        console.log(`Connecté au broker MQTT : ${mqttUrl}`)

        //s'abonne aux topics des mesures
        client.subscribe(mqttTopics, (error) => {
            if (error) {
                console.error('Erreur subscription MQTT:', error)
                return
            }

            console.log(`Abonné aux topics MQTT : ${mqttTopics.join(', ')}`)
        })
    })
    //Quand un message arrive 
    client.on('message', async (topic, payload) => {
        const message = payload.toString();
        console.log(`Message MQTT reçu sur ${topic}: ${message}`)

        if (topic !== temperatureTopic && topic !== humidityTopic) {
            console.warn(`Topic MQTT ignoré : ${topic}`)
            return
        }

        const value = parseSensorValue(message)

        if (value === null) {
            console.warn(`Message MQTT invalide sur ${topic}: ${message}`)
            return
        }

        if (topic === temperatureTopic) {
            latestTemperature = value
        }

        if (topic === humidityTopic) {
            latestHumidite = value
        }

        const mesure = createMesureObject(latestTemperature, latestHumidite)

        if (!mesure) {
            console.log(`Valeur reçue sur ${topic}: ${value}. En attente de l'autre valeur.`)
            return
        }

        try {
            await saveMesure(mesure.temperature, mesure.humidite)
            latestTemperature = null
            latestHumidite = null
        } catch (error) {
            console.error('Erreur enregistrement mesure:', error)
        }
    })

    //Gestion des erreurs 
    client.on('error', (error) => {
        console.error('Erreur MQTT:', error)
    })
}

export function publishMqttMessage(topic: string, message: string): Promise<void> {
    if (!mqttClient) {
        throw new Error('Client MQTT non initialisé')
    }

    if (!mqttClient.connected) {
        throw new Error('Client MQTT non connecté')
    }

    return new Promise((resolve, reject) => {
        mqttClient?.publish(topic, message, (error) => {
            if (error) {
                reject(error)
                return
            }

            console.log(`Message MQTT publié sur ${topic}: ${message}`)
            resolve()
        })
    })
}

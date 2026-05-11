const express = require('express')
const { PrismaClient } = require('@prisma/client')
  const { PrismaLibSql } = require('@prisma/adapter-libsql')
const { createClient } = require('@libsql/client')

const libsql = createClient({
  url: 'file:./prisma/dev.db'
})

const adapter = new PrismaLibSql({ client: libsql })
const prisma = new PrismaClient({ adapter })

const app = express()
app.use(express.json())
// CREATE — reçoit les données du Pico
app.post('/api/mesures', async (req, res) => {
  const { temperature, humidite } = req.body
  if (temperature == null || humidite == null)
    return res.status(400).json({ error: 'Champs manquants' })

  const mesure = await prisma.mesure.create({
    data: { temperature, humidite }
  })
  res.status(201).json(mesure)
})

// READ ALL — toutes les mesures
app.get('/api/mesures', async (req, res) => {
  const mesures = await prisma.mesure.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json(mesures)
})

// READ ONE — une mesure par id
app.get('/api/mesures/:id', async (req, res) => {
  const mesure = await prisma.mesure.findUnique({
    where: { id: Number(req.params.id) }
  })
  if (!mesure) return res.status(404).json({ error: 'Introuvable' })
  res.json(mesure)
})

// UPDATE — modifier une mesure
app.put('/api/mesures/:id', async (req, res) => {
  const { temperature, humidite } = req.body
  try {
    const mesure = await prisma.mesure.update({
      where: { id: Number(req.params.id) },
      data: { temperature, humidite }
    })
    res.json(mesure)
  } catch {
    res.status(404).json({ error: 'Introuvable' })
  }
})

// DELETE — supprimer une mesure
app.delete('/api/mesures/:id', async (req, res) => {
  try {
    await prisma.mesure.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch {
    res.status(404).json({ error: 'Introuvable' })
  }
})

app.listen(3000, () => console.log('🚀 Backend sur http://localhost:3000'))
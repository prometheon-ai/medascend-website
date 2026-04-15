import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import EarlyAccess from './models/EarlyAccess.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.post('/api/early-access', async (req, res) => {
  try {
    const { name, college, email, phone } = req.body

    if (!name || !college || !email) {
      return res.status(400).json({ error: 'Name, college, and email are required.' })
    }

    const existing = await EarlyAccess.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered for early access.' })
    }

    const signup = await EarlyAccess.create({
      name: name.trim(),
      college: college.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
    })

    res.status(201).json({ message: 'Registered successfully', id: signup._id })
  } catch (err) {
    console.error('Early access error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

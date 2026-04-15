import mongoose from 'mongoose'

let cached = global._mongoConn

async function connectDB() {
  if (cached) return cached
  cached = global._mongoConn = await mongoose.connect(process.env.MONGODB_URI)
  return cached
}

const earlyAccessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

const EarlyAccess = mongoose.models.EarlyAccess || mongoose.model('EarlyAccess', earlyAccessSchema)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

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
}

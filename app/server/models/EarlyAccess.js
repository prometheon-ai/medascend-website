import mongoose from 'mongoose'

const earlyAccessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('EarlyAccess', earlyAccessSchema)

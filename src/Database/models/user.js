import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: 'Please add an email address',
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: 'Please add a password', unique: false },
    firstName: { type: String, required: 'Firstname can not be empty', unique: false },
    surName: { type: String, required: 'Surname can not be empty', unique: false },
    role: { type: String, Enum: ['Admin', 'creator', 'user'], defaultValue: 'user' },
    status: { type: String, Enum: ['Active', 'Inactive'], defaultValue: 'Active' },
})


export default mongoose.model('User', userSchema)

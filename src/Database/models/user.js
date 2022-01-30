import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING(600), allowNull: false, unique: false },
    role: { type: DataTypes.ENUM('Admin', 'creator', 'user'), allowNull: true, defaultValue: 'user' },
    firstName: { type: DataTypes.STRING(5), allowNull: false, unique: false },
    surName: { type: DataTypes.STRING(5), allowNull: false, unique: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
  })

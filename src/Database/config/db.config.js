import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
        try {
                const conn = await mongoose.connect(process.env.MONGO_URI, {})

                console.log('Connection has been established successfully...'.bgGreen.bold);
        } catch (err) {
                console.error(err)
                process.exit(1)
        }
}

module.exports = connectDB

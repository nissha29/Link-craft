import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.config.js'
import urlRouter from './routes/url.route.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
dotenv.config()

const allowedOrigins = ['http://localhost:5173', 'https://link-craft-ixeh.vercel.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use('/url', urlRouter)

app.listen(process.env.PORT, ()=>{
    connectDB()
    console.log(`Server Started`)
})
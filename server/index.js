import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv"
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
import { register } from "./controllers/auth.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import challengeRoutes from "./routes/challenges.js"
import {createChallenge} from "./controllers/challenges.js"
import { verifyToken } from './middleware/auth.js';


//Middleware and Packages Setup

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

//Env
dotenv.config()

//Initialize App
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

//File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

//Upload
const upload = multer({ storage })


//Routes with File needs
app.post("/auth/register", upload.single("picture"), register)
app.post('/challenges', verifyToken, upload.single("picture"), createChallenge)

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/challenges", challengeRoutes)

//Mongoose Setup
const PORT = process.env.PORT || 6001
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`))
}).catch((err) => console.log(`${err}, did not connect`))
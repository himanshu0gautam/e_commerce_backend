import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDb from './src/db/db.js';
import cors from 'cors'
import ip from 'ip'


dotenv.config({
    path: './.env'
});

const Ip = ip.address()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://192.168.1.59:5173",
    "http://192.168.1.59:3000",
    "http://192.168.1.59:3001"
  ],
  credentials: true
}));


connectDb();

app.listen(process.env.PORT,'0.0.0.0', () =>{
    console.log(`server on listen on :${process.env.PORT}:${Ip}`); 
});


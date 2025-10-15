import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDb from './src/db/db.js';
import ip from 'ip'


dotenv.config({
    path: './.env'
});

const Ip = ip.address()


connectDb();

app.listen(process.env.PORT,'0.0.0.0', () =>{
    console.log(`server on listen on: ${Ip}:${process.env.PORT}`); 
});


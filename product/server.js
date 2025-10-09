import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDb from './src/db/db.js';


dotenv.config({
    path: './.env'
});

connectDb();

app.listen(process.env.PORT,`0.0.0.0`, () =>{
    console.log(`server on listen on :${process.env.PORT}`); 
});


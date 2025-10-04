import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDb from './src/db/db.js';


dotenv.config({
    path: './.env'
});

connectDb();

app.listen(process.env.PORT, () =>{
    console.log(`server on listen on PORT http://localhost:${process.env.PORT}`); 
});


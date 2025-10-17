require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')


port=process.env.PORT || 3000;
connectDb()

const IP = require("ip").address();

app.listen(port,'0.0.0.0',() =>{
    console.log(`server is running on ${port}://${IP}:3000`);
})


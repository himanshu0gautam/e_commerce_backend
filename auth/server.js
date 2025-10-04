require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')

port=process.env.PORT
connectDb()
app.get('/', (res,req)=>{
    console.log("hirted")
})
app.listen(port,() =>{
    console.log(`server is running on ${port}`);
})


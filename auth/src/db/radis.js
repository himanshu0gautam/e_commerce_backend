const Redis = require('ioredis')

const radis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
})

radis.on("connect",() => {
    console.log("Connected to Redis");
})

radis.on('error', (err) => {
  console.error('Redis error:', err);
});





module.exports =  radis
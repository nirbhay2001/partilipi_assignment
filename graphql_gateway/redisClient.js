const Redis = require("redis")
const redisClient = Redis.createClient({
    socket:{
        host: "redis",
        port: 6379
    }
});

redisClient.connect()
.then(()=>console.log("Redis dtabase is connected"))
.catch(err=>console.error("Redis connection fail:",err))

module.exports = redisClient
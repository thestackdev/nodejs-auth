import redis from 'redis'

const { RedisUrl, RedisPassword } = process.env

const client = redis.createClient({
  url: RedisUrl,
  password: RedisPassword,
})

client.connect()

client.on('connect', () => {
  console.log('Redis connection succeed')
})

client.on('error', (err) => {
  console.log(`Redis connection failed ${err.message}`)
})

export default client

import { app } from './app'
import { env } from './env'

app
  .listen({ port: env.PORT })
  .then(() => console.log('Server Running on port:3333 🚀🚀'))

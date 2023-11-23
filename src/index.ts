import dotenv from 'dotenv'
import {connectDB} from "./DB/db"
import app from './app/app'
import http from 'http'
dotenv.config()

const server = http.createServer(app)

connectDB()
.then(() => {
    server.listen(process.env.PORT!,() => {
        console.log(`server is running on port ${process.env.PORT!}`)
    })
}).catch(error =>{
    console.log('Error while running server', error)
    server.close(() => process.exit(1))
});



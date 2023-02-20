import { Request, Response } from "express"
// @ts-ignore
import UserRouter from "./routes/users.ts"
// @ts-ignore
import ProductRouter from "./routes/products.ts"
// @ts-ignore
import SearchRouter from "./routes/search.ts"
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import bodyParser from "body-parser"
import { createServer } from 'http'



const app = express()


dotenv.config()

app.use(cors({
    origin: "*",
}))
app.use(bodyParser.json())
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));



app.use('/users', UserRouter)

app.use('/products', ProductRouter)

app.use('/search', SearchRouter)

app.use('/', (_req: Request, res: Response) => {
    res.json({ message: "This is home page API" })
})


const server = createServer(app)
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server on running on port ${PORT}`);
})

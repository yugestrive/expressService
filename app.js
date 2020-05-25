import express from 'express'
import cors from 'cors'

import {registerRouters} from './routes'

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: false }))

registerRouters(app)

app.listen(3000, () => console.log('Server runing...'))
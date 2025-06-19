import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { adminController } from './controllers/admin.controller'
import { firstLevelCategoryController } from './controllers/first-level-category.controller'
import { productsController } from './controllers/products.controller'
import { secondLevelCategoryController } from './controllers/second-level-category.controller'
import { slidesController } from './controllers/slides.controller'
import { storageController } from './controllers/storage.controller'
import { textsController } from './controllers/texts.controller'
import { errorMiddleware } from './middlewares/error.middleware'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'https://light2u.com.ua',
			'https://light-2u.vercel.app'
		],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization']
	})
)
app.use(express.json())
app.use(cookieParser())

app.use('/api/texts', textsController)
app.use('/api/admins', adminController)
app.use('/api/slides', slidesController)
app.use('/api/storage', storageController)
app.use('/api/products', productsController)
app.use('/api/first-level-categories', firstLevelCategoryController)
app.use('/api/second-level-categories', secondLevelCategoryController)

app.use(errorMiddleware)

app.listen(port, () => {
	console.log(`Light 2u Server listening on port ${port}`)
})

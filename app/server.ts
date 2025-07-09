import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { adminController } from './controllers/admin.controller'
import { firstLevelCategoryController } from './controllers/first-level-category.controller'
import { productController } from './controllers/product.controller'
import { secondLevelCategoryController } from './controllers/second-level-category.controller'
import { slideController } from './controllers/slide.controller'
import { storageController } from './controllers/storage.controller'
import { textController } from './controllers/text.controller'
import { errorMiddleware } from './middlewares/error.middleware'
import { objectController } from './controllers/object.controller'

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

app.use('/api/texts', textController)
app.use('/api/admins', adminController)
app.use('/api/slides', slideController)
app.use('/api/objects', objectController)
app.use('/api/storage', storageController)
app.use('/api/products', productController)
app.use('/api/first-level-categories', firstLevelCategoryController)
app.use('/api/second-level-categories', secondLevelCategoryController)

app.use(errorMiddleware)

app.listen(port, () => {
	console.log(`Light 2u Server listening on port ${port}`)
})

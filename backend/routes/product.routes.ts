import {Router} from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import adminMiddleware from '../middlewares/admin.middleware'
import upload from '../lib/multer'
import { createProduct, deleteImage, deleteProduct, getNewArrivals, getProduct, toggleWish, updateProduct } from '../controllers/product.controller'

const productRouter = Router()

productRouter.get("/new-arrivals", getNewArrivals)
productRouter.get("/:id", getProduct)
productRouter.post("/create", authMiddleware, adminMiddleware, upload.array("image"), createProduct)
productRouter.post("/toggle-wish", authMiddleware, toggleWish)
productRouter.patch("/:id", authMiddleware, adminMiddleware, updateProduct)
productRouter.delete("/image/:id", authMiddleware, adminMiddleware, deleteImage)
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProduct)
export default productRouter
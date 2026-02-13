import express from "express"
import { placeOrderController,getOrdersController } from "#controllers/order.controller.js"
import { authenticateToken } from "#middleware/auth.middleware.js"

const router=express.Router()

router.post("/place",placeOrderController)
router.get("/get",authenticateToken,getOrdersController)

export default router
import express from "express"
import { placeOrderController,getOrdersController, checkStock, payOrder, getOrderDetails } from "#controllers/order.controller.js"
import { authenticateToken } from "#middleware/auth.middleware.js"

const router=express.Router()

router.post("/place",placeOrderController)
router.get("/get",authenticateToken,getOrdersController)
router.post("/check_stock",checkStock)
router.post("/payment",payOrder)
router.get("/details/:id",authenticateToken,getOrderDetails)

export default router
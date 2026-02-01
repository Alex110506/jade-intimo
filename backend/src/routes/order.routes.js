import express from "express"
import { placeOrderController } from "#controllers/order.controller.js"

const router=express.Router()

router.post("/place",placeOrderController)

export default router
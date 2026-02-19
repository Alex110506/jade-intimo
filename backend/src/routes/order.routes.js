import express from "express"
import { placeOrderController,getOrdersController, checkStock, payOrder, getOrderDetails,getAdminOrders,getAdminOrder,updateAdminOrder } from "#controllers/order.controller.js"
import { authenticateToken } from "#middleware/auth.middleware.js"
import { adminRoute } from "#middleware/admin.middleware.js"

const router=express.Router()

//user
router.post("/place",placeOrderController)
router.get("/get",authenticateToken,getOrdersController)
router.post("/check_stock",checkStock)
router.post("/payment",payOrder)
router.get("/details/:id",authenticateToken,getOrderDetails)


//admin
router.get("/admin",authenticateToken,adminRoute,getAdminOrders)
router.route("/admin/:id")
    .get(authenticateToken,adminRoute,getAdminOrder)
    .patch(authenticateToken,adminRoute,updateAdminOrder)

export default router
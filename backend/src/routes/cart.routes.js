import express from "express"

import { getCart,addToCart,updateQuantity,removeItem } from "#controllers/cart.controller.js"
import { authenticateToken } from "#middleware/auth.middleware.js"

const router=express.Router()

router.use(authenticateToken)

router.route("/")
    .get(getCart)
    .post(addToCart)

router.route("/:id")
    .patch(updateQuantity)
    .delete(removeItem)

export default router
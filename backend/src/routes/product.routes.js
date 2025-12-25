import { getNewProducts, getProductById, getProducts } from "#controllers/products.controller.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import express from "express";

const router=express.Router()

//user endpoints

router.get("/",getProducts)
router.get('/new',getNewProducts)
router.get("/:id",getProductById)

//admin endpoints

// router.route("/")
//     .get(adminRoute,getProductsAdmin) // aici sa fac si variante si produs sa fie mai usor cu stocu
//     .post(adminRoute,createProduct)

// router.route("/item/:id")
//     .put(authenticateToken,adminRoute,updateProduct)
//     .delete(authenticateToken,adminRoute,deleteProduct)
//     .post(authenticateToken,adminRoute,addImage)

// router.route("/varaint/:id")
//     .put(authenticateToken,adminRoute,updateVariant)


export default router
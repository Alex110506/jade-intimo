import { getNewProducts, 
    getProductById, 
    getProducts,
    getProductsAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin
} from "#controllers/products.controller.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import express from "express";

const router=express.Router()

//user endpoints

router.get("/",getProducts)
router.get('/new',getNewProducts)
router.get("/:id",getProductById)

//admin endpoints

router.route("/admin")
    .get(authenticateToken,adminRoute,getProductsAdmin) // aici sa fac si variante si produs sa fie mai usor cu stocu
    .post(authenticateToken,adminRoute,createProductAdmin)

router.route("/admin/item/:id")
    .put(authenticateToken,adminRoute,updateProductAdmin)
    .delete(authenticateToken,adminRoute,deleteProductAdmin)
    //.post(authenticateToken,adminRoute,addImage)

// router.route("/varaint/:id")
//     .put(authenticateToken,adminRoute,updateVariant)


export default router
import { 
    getNewProducts, 
    getProductById, 
    getProducts,
    getProductsAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    createVariantAdmin,
    updateVariantAdmin,
} from "#controllers/products.controller.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import express from "express";

const router=express.Router()



//admin endpoints

router.route("/admin")
    .get(authenticateToken,adminRoute,getProductsAdmin) // aici sa fac si variante si produs sa fie mai usor cu stocu
    .post(authenticateToken,adminRoute,createProductAdmin)

router.route("/admin/item/:id")
    .put(authenticateToken,adminRoute,updateProductAdmin)
    .delete(authenticateToken,adminRoute,deleteProductAdmin)
    //.post(authenticateToken,adminRoute,addImage)

router.route("/admin/variant/:id")
    .put(authenticateToken,adminRoute,updateVariantAdmin)
    .post(authenticateToken,adminRoute,createVariantAdmin)


//user endpoints

router.get("/",getProducts)
router.get('/new',getNewProducts)
router.get("/:id",getProductById)


export default router
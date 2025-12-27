//user role controllers

import { db } from "#config/database.js";
import logger from "#config/logger.js"
import { products } from "#models/product.model.js";
import { insertProduct, retrieveAllProducts, retrieveNewArrivals, retrieveProductById, updateProduct } from "#services/products.service.js"
import { createProductSchema, updateProductScheema } from "#validations/product.validation.js";
import { formatValidationError } from "#utils/format.js";
import { eq } from "drizzle-orm";

export const getProducts = async (req, res) => {
    try {
        const { page, limit, gender, category, subCategory ,sortBy} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const data = await retrieveAllProducts(
            pageNum, 
            limitNum, 
            gender, 
            category, 
            subCategory,
            sortBy
        );

        logger.info(`Products retrieved successfully - Page: ${pageNum}`);

        res.status(200).json({
            message: "Data retrieved successfully",
            ...data
        });

    } catch (error) {
        logger.error("Error in getting products:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

export const getNewProducts=async (req,res)=>{
    try {
        const {limit}=req.query

        const data=await retrieveNewArrivals(limit)

        logger.info("new products retrieved sucessfully")

        res.status(200).json({
            message:"new products retrieved sucessfully",
            products:data
        })
    } catch (error) {
        logger.error('Error in getting new products', error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

export const getProductById=async (req,res)=>{
    const {id}=req.query
    try {
        const data=await retrieveProductById(id)
        
        logger.info(`product with id ${id} retrieved successfully`)

        res.status(200).json({
            message:`product with id ${id} retrieved successfully`,
            product:data
        })
    } catch (error) {
        logger.error(`Error in getting product with id ${id}:`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

//admin role controllers

export const getProductsAdmin = async (req, res) => {
    try {
        const { page, limit, gender, category, subCategory ,sortBy} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const data = await retrieveAllProducts(
            pageNum, 
            limitNum, 
            gender, 
            category, 
            subCategory,
            sortBy
        );

        logger.info(`Products for admin retrieved successfully - Page: ${pageNum}`);

        res.status(200).json({
            message: "Data for admin retrieved successfully",
            ...data
        });

    } catch (error) {
        logger.error("Error in getting products for admin:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

export const createProductAdmin = async (req, res) => {
    try {
        const body = {
            ...req.body,
            price: typeof req.body.price === "string" ? Number(req.body.price) : req.body.price,
            bigSizes: req.body.bigSizes === "true" ? true : req.body.bigSizes,
        };

        const result = createProductSchema.safeParse(body);

        if (!result.success) {
            return res.status(400).json({
                error: 'Crearea Produsului Esuata',
                details: formatValidationError(result.error), 
            });
        }

        const { 
            gender, category, subCategory, name, 
            image, description, material, price, bigSizes 
        } = result.data;

        const product = await insertProduct({
            gender, category, subCategory, name, 
            image, description, material, price, bigSizes
        });

        if (!product) {
            logger.error('Insert returned no product');
            return res.status(500).json({ error: 'Could not create product' });
        }

        logger.info(`Product with id ${product.id} created successfully`);

        return res.status(201).json({
            message: "Product created successfully",
            product: product
        });

    } catch (error) {
        logger.error(`Error creating product:`, error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

export const updateProductAdmin=async (req,res)=>{
    try {
        const validationResult=updateProductScheema.safeParse(req.body)
        const {id}=req.params

        if(!validationResult.success){
            return res.status(400).json({
                error: 'Actualizarea Produsului Esuata',
                details: formatValidationError(validationResult.error),
            });
        }

        const data={...validationResult.data}

        const product=await updateProduct(Number(id),data)

        if (!product) {
            return res.status(404).json({ error: 'Produsul nu a fost găsit' });
        }

        return res.status(200).json({
            message:"product updated sucessfully",
            product:product
        })
    } catch (error) {
        logger.error('product update error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteProductAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const [deleted] = await db
            .delete(products)
            .where(eq(products.id, Number(id)))
            .returning();

        if (!deleted) {
            return res.status(404).json({
                error: "Produsul nu a fost găsit",
                message: `Nu există niciun produs cu ID-ul ${id}`
            });
        }

        logger.info(`Product deleted by admin: ${deleted.name} (ID: ${deleted.id})`);

        return res.status(200).json({
            message: "Produsul a fost șters cu succes",
            deletedProduct: deleted
        });

    } catch (error) {
        logger.error(`Error deleting product ${req.params.id}:`, error);
        return res.status(500).json({ 
            error: "Eroare internă de server",
            message: error.message 
        });
    }
};
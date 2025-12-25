//user role controllers

import logger from "#config/logger.js"
import { retrieveAllProducts, retrieveNewArrivals, retrieveProductById } from "#services/products.service.js"

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
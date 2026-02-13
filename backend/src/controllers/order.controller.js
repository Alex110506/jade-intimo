import logger from "#config/logger.js";
import { createOrder, getOrdersByUserId } from "#services/order.service.js";
import { formatValidationError } from "#utils/format.js";
import { createOrderSchema } from "#validations/order.validation.js";
import jwt from "jsonwebtoken";

export const placeOrderController = async (req, res) => {
    try {
        const token = req.cookies.token;
        let user_id = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id;
            } catch (err) {
                logger.warn("Invalid token on checkout, proceeding as guest");
            }
        }
    
        const body = req.body; 

        const result = createOrderSchema.safeParse(body);

        if (!result.success) {
            return res.status(400).json({
                error: "Order Validation Failed",
                details: formatValidationError(result.error)
            });
        }

        const orderData = result.data;

        const insertResult = await createOrder({
            ...orderData,
            user_id: user_id
        });        

        if (!insertResult) {
            logger.error("Insert returned no order");
            return res.status(500).json({
                error: "Could not place order"
            });
        }

        logger.info(`Order with id ${insertResult.orderId} placed successfully`);

        // TODO: Email Service Trigger Here

        return res.status(201).json({
            message: "Order placed successfully",
            id: insertResult.orderId
        });

    } catch (error) {
        logger.error(`Error placing order:`, error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

export const getOrdersController=async (req,res)=>{
    try {
        const userId=req.user.id
        const result=await getOrdersByUserId(userId)
        
        return res.status(200).json({
            result
        })
    } catch (error) {
        logger.error(`Error getting orders:`, error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
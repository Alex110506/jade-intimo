import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { orderItems } from "#models/order-items.model.js";

const createOrder = async ({
    user_id,
    email,
    first_name,
    last_name,
    address_line,
    city,
    state,
    postal_code,
    country,
    total_ammount,
    items,
    payment_method
}) => {
    try {
        const result = await db.transaction(async (tx) => {
            
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    user_id: user_id || null, 
                    total_ammount: total_ammount,
                    email,
                    first_name,
                    last_name,
                    address_line,
                    city,
                    state,
                    postal_code,
                    country,
                    status: 'pending'
                })
                .returning({ id: orders.id });

            if (!newOrder) {
                throw new Error("Failed to create order");
            }

            const orderItemsData = items.map((item) => ({
                order_id: newOrder.id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            if (orderItemsData.length > 0) {
                await tx.insert(orderItems).values(orderItemsData);
            }

            return { orderId: newOrder.id, status: "success" };
        });

        return result;

    } catch (error) {
        console.error("Transaction Error:", error);
        throw error;
    }
};

export { createOrder };
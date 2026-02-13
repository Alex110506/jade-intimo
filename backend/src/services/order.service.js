import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { orderItems } from "#models/order-items.model.js";
import { desc, eq } from "drizzle-orm";
import { carts } from "#models/cart.model.js"; 
import { cart_items } from "#models/cart-items.model.js";

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
        // We use the transaction 'tx' for EVERYTHING here. 
        // If any step fails, the order rolls back AND the cart items are not deleted.
        const result = await db.transaction(async (tx) => {
            
            let shipping_cost=0
            if(total_ammount<10000)
                shipping_cost=1000

            const [newOrder] = await tx
                .insert(orders)
                .values({
                    user_id: user_id || null, 
                    total_ammount,
                    email,
                    first_name,
                    last_name,
                    address_line,
                    city,
                    state,
                    postal_code,
                    country,
                    status: 'pending',
                    shipping_cost
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

            if (user_id) {
                const [userCart] = await tx
                    .select()
                    .from(carts)
                    .where(eq(carts.user_id, user_id));

                if (userCart) {
                    await tx
                        .delete(cart_items)
                        .where(eq(cart_items.cart_id, userCart.id));
                }
            }

            return { orderId: newOrder.id, status: "success" };
        });

        return result;

    } catch (error) {
        console.error("Transaction Error:", error);
        throw error;
    }
};

const getOrdersByUserId = async (userId) => {
    try {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.user_id, userId))
            .orderBy(desc(orders.created_at));

        return userOrders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
};

export { createOrder,getOrdersByUserId };
import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { orderItems } from "#models/order-items.model.js";
import { product_variants } from "#models/product-variant.model.js";
import { carts } from "#models/cart.model.js"; 
import { cart_items } from "#models/cart-items.model.js";
import { desc, eq, inArray, sql } from "drizzle-orm";

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
                    status: 'shipping',
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

const verifyStock = async (items) => {
    const variantIds = items.map((item) => item.variant_id);

    if (variantIds.length === 0) return true;

    const dbVariants = await db
        .select({
            id: product_variants.id,
            quantity: product_variants.quantity,
        })
        .from(product_variants)
        .where(inArray(product_variants.id, variantIds));

    const variantsMap = new Map(dbVariants.map((v) => [v.id, v]));

    for (const item of items) {
        const dbVariant = variantsMap.get(item.variant_id);

        if (!dbVariant) {
            throw new Error(`Product variant with ID ${item.variant_id} does not exist.`);
        }

        if (dbVariant.quantity < item.quantity) {
            throw new Error(
                `Insufficient stock for variant ID ${item.variant_id}. Requested: ${item.quantity}, Available: ${dbVariant.quantity}`
            );
        }
    }

    return true;
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


const fetchDetails=async (userId,orderId)=>{
    try {
        const order=await db
            .select()
            .from(orders)
            .where(
                and(
                    eq(orders.id,orderId),
                    eq(orders.user_id,userId)
                )                
            )

        if(!order){
            throw new Error("No order found...")
        }

        const dbItems = await db
            .select({
                variantId: product_variants.id,
                size: product_variants.size,
                productName: products.name,
                price: orderItems.price_at_purchase,
                quantity:orderItems.quantity
            })
            .from(product_variants)
            .leftJoin(products, eq(product_variants.product_id, products.id))
            .where(inArray(product_variants.id, variantIds));
    } catch (error) {
        
    }
}

export { createOrder,getOrdersByUserId,verifyStock,fetchDetails};
import { db } from "#config/database.js"
import { product_variants } from "#models/product-variant.model.js";
import { products } from "#models/product.model.js"
import { count as countFn } from "drizzle-orm"
import { eq, desc ,and, asc} from "drizzle-orm";

export const retrieveAllProducts = async (
    page = 1, 
    limit = 10, 
    gender = "", 
    category = "", 
    subCategory = "", 
    sortBy = "newest"
) => {
    try {
        const offset = (page - 1) * limit;

        const filters = [];
        if (gender) filters.push(eq(products.gender, gender));
        if (category) filters.push(eq(products.category, category));
        if (subCategory) filters.push(eq(products.subCategory, subCategory));
        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        let orderByClause;
        switch (sortBy) {
            case "price-low-high":
                orderByClause = asc(products.price);
                break;
            case "price-high-low":
                orderByClause = desc(products.price);
                break;
            case "best-selling":
                orderByClause = desc(products.soldPieces);
                break;
            case "newest":
            default:
                orderByClause = desc(products.createdAt);
                break;
        }

        const data = await db
            .select()
            .from(products)
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset);

        const [totalCountResult] = await db
            .select({ value: countFn() })
            .from(products)
            .where(whereClause);
        
        const totalItems = totalCountResult?.value || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            products: data,
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page),
                itemsPerPage: Number(limit)
            }
        };

    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Could not retrieve products from the database");
    }
};


export const retrieveNewArrivals = async (limit=20) => {
  try {
    const womenNewest = await db
      .select()
      .from(products)
      .where(eq(products.gender, "women"))
      .orderBy(desc(products.created_at))
      .limit(limit);

    const menNewest = await db
      .select()
      .from(products)
      .where(eq(products.gender, "men"))
      .orderBy(desc(products.created_at))
      .limit(limit);

    return {
      women: womenNewest,
      men: menNewest,
    };
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw new Error("Could not retrieve new arrivals");
  }
};


export const retrieveProductById = async (productId) => {
    try {
        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        const varaints=await db
            .select()
            .from(product_variants)
            .where(eq(product_variants.product_id,productId))

        if (!product) {
            return null;
        }
        return {
            product:product,
            varaints,varaints
        };
    } catch (error) {
        console.error(`Error retrieving product with ID ${productId}:`, error);
        throw new Error("Database query failed");
    }
};
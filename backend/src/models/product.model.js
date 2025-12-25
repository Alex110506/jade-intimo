import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  pgEnum,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";


export const genderEnum = pgEnum("gender", ["women", "men"]);

export const categoryEnum = pgEnum("category", [
  "noutati", "curvy-marimi-mari", "sutiene", "chiloti", 
  "lenjerie", "pijamale", "imbracaminte", "costume-de-baie", "sosete"
]);

export const subCategoryEnum = pgEnum("subcategory", [
  "toate", "toti", "push-up", "balconet", "triunghi", "bralette-bustiera",
  "clasic-cupa-buretata", "clasic-neburetat-sarma", "multifunctional",
  "cu-burete", "fara-burete", "cu-sarma", "fara-sarma", "brazilian", 
  "tanga", "slip", "talie-inalta", "modelator", "invizibili-fara-cusaturi",
  "body", "corset", "portjartiera", "halat", "babydoll", "top", "maiou", 
  "accesorii", "maneca-lunga-pantalon-lung", "camasa-de-noapte", 
  "lenjerie-de-noapte", "pijamale-premium", "pijamale-pentru-copii", 
  "tricouri-polo", "treninguri", "tinute-de-casa", "maiouri", "sosete", 
  "dresuri", "costume-intregi", "costume-intregi-modelatoare", 
  "costume-2-piese", "sutien-de-baie", "slip-de-baie", "tankini", 
  "tinute-de-plaja", "scuba", "costume-push-up", "costume-chilot-brazilian",
  "clasici", "boxeri", "pijamale-pentru-barbati", "tricouri", "short-uri", "slipuri",
  "body-si-corset", "chiloti-curvy"
]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  gender: genderEnum("gender").notNull(),
  category: categoryEnum("category").notNull(),
  subCategory: subCategoryEnum("subcategory"),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").notNull(),
  description: text("description"),
  material: varchar("material", { length: 100 }),
  price: integer("price").notNull(), 
  bigSizes: boolean("big_sizes").notNull().default(false),
  soldPieces: integer("sold_pieces").notNull().default(0),
  created_at: timestamp().defaultNow().notNull()
});
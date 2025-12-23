import { motion } from 'framer-motion';
import { useGender } from '@/context/GenderContext';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

const NewArrivals = () => {
  const { gender } = useGender();
  const newProducts = products.filter(
    (p) => p.gender === gender && p.isNew
  ).slice(0, 4);

  // If no new products for this gender, show first 4 products
  const displayProducts = newProducts.length > 0 
    ? newProducts 
    : products.filter(p => p.gender === gender).slice(0, 4);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-muted-foreground">
              The latest additions to our collection
            </p>
          </div>
          <a
            href={`/${gender}/new`}
            className="text-sm font-medium uppercase tracking-wider text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            View All
          </a>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

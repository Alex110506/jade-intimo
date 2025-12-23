import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGender } from '@/context/GenderContext';
import { womenCategories, menCategories } from '@/data/products';
import categoryBras from '@/assets/category-bras.jpg';
import categoryLingerie from '@/assets/category-lingerie.jpg';
import categoryPajamas from '@/assets/category-pajamas.jpg';
import categorySwimwear from '@/assets/category-swimwear.jpg';
import categoryMenUnderwear from '@/assets/category-men-underwear.jpg';

const categoryImages: Record<string, string> = {
  bras: categoryBras,
  lingerie: categoryLingerie,
  pajamas: categoryPajamas,
  'bathing-suits': categorySwimwear,
  underwear: categoryMenUnderwear,
  panties: categoryBras,
  clothing: categoryPajamas,
  socks: categoryMenUnderwear,
  new: categoryLingerie,
};

const FeaturedCategories = () => {
  const { gender } = useGender();
  const categories = gender === 'women' ? womenCategories : menCategories;
  const displayCategories = categories.slice(1, 5);

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-muted-foreground">
            Find your perfect fit in our curated collections
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/${gender}/${category.slug}`}
                className="group block overflow-hidden"
              >
                <div className="image-zoom relative aspect-[3/4] overflow-hidden bg-secondary">
                  <img
                    src={categoryImages[category.slug] || categoryBras}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent opacity-80 transition-opacity duration-base group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <h3 className="font-heading text-xl font-medium">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-background/80">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

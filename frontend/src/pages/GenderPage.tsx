import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { womenCategories, menCategories } from '@/data/products';
import categoryBras from '@/assets/category-bras.jpg';
import categoryLingerie from '@/assets/category-lingerie.jpg';
import categoryPajamas from '@/assets/category-pajamas.jpg';
import categorySwimwear from '@/assets/category-swimwear.jpg';
import categoryMenUnderwear from '@/assets/category-men-underwear.jpg';
import { useEffect } from 'react';

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

const GenderPage = () => {
  const location = useLocation();
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const isWomen = gender === 'women';
  const categories = isWomen ? womenCategories : menCategories;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jade-intimo.com' },
      { '@type': 'ListItem', position: 2, name: isWomen ? 'Women' : 'Men', item: `https://jade-intimo.com/${gender}` },
    ],
  };

  useEffect(()=>{
    try {
      
    } catch (error) {
      
    }
  },[])

  return (
    <>
      <SEO
        title={isWomen ? "Women's Collection" : "Men's Collection"}
        description={isWomen 
          ? "Shop women's intimates, lingerie, bras, panties, pajamas, and swimwear. Elegant designs for every occasion."
          : "Shop men's underwear, pajamas, clothing, and swimwear. Premium comfort meets sophisticated style."
        }
        keywords={isWomen 
          ? "women lingerie, bras, panties, women pajamas, women swimwear, intimates"
          : "men underwear, men pajamas, men clothing, men swimwear, boxer briefs"
        }
        url={`https://jade-intimo.com/${gender}`}
        schema={breadcrumbSchema}
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main" className="pt-[105px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground" itemProp="item">
                    <span itemProp="name">Home</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span className="font-medium capitalize" itemProp="name">{gender}</span>
                  <meta itemProp="position" content="2" />
                </li>
              </ol>
            </div>
          </nav>

          {/* Header */}
          <header className="container-custom py-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl font-semibold capitalize md:text-5xl"
            >
              {gender}'s Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              {isWomen
                ? 'Discover our curated selection of elegant intimates and loungewear'
                : 'Premium essentials designed for comfort and style'}
            </motion.p>
          </header>

          {/* Categories Grid */}
          <section className="container-custom pb-20" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="sr-only">Shop by Category</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <motion.article
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/${gender}/${category.slug}`}
                    className="group block overflow-hidden"
                    aria-label={`Shop ${category.name}`}
                  >
                    <figure className="image-zoom relative aspect-[4/5] overflow-hidden bg-secondary">
                      <img
                        src={categoryImages[category.slug] || categoryBras}
                        alt={`${category.name} - ${category.description}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-base group-hover:from-foreground/80">
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <h3 className="font-heading text-2xl font-semibold text-background">
                            {category.name}
                          </h3>
                          <p className="mt-2 text-sm text-background/80">
                            {category.description}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-background transition-all group-hover:gap-3">
                            Shop Now
                            <ChevronRight size={16} aria-hidden="true" />
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GenderPage;

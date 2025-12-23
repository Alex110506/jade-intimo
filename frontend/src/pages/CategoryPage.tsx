import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { products, womenCategories, menCategories } from '@/data/products';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('newest');
  
  // Extract gender from the URL path
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const isWomen = gender === 'women';
  const categories = isWomen ? womenCategories : menCategories;

  const currentCategory = categories.find((c) => c.slug === category);

  // Filter products
  let filteredProducts = products.filter((p) => p.gender === gender);

  if (category === 'new') {
    filteredProducts = filteredProducts.filter((p) => p.isNew);
  } else if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // If no products match, show all for that gender
  if (filteredProducts.length === 0) {
    filteredProducts = products.filter((p) => p.gender === gender);
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jade-intimo.com' },
      { '@type': 'ListItem', position: 2, name: isWomen ? 'Women' : 'Men', item: `https://jade-intimo.com/${gender}` },
      { '@type': 'ListItem', position: 3, name: currentCategory?.name || 'Products', item: `https://jade-intimo.com/${gender}/${category}` },
    ],
  };

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: currentCategory?.name || 'Products',
    numberOfItems: sortedProducts.length,
    itemListElement: sortedProducts.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <>
      <SEO
        title={currentCategory?.name || 'Products'}
        description={`Shop ${currentCategory?.name?.toLowerCase() || 'products'} at Jade Intimo. ${currentCategory?.description || 'Premium quality intimates and loungewear.'}`}
        keywords={`${currentCategory?.name?.toLowerCase()}, ${gender} ${currentCategory?.name?.toLowerCase()}, buy ${currentCategory?.name?.toLowerCase()}`}
        url={`https://jade-intimo.com/${gender}/${category}`}
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
                  <Link to={`/${gender}`} className="text-muted-foreground capitalize transition-colors hover:text-foreground" itemProp="item">
                    <span itemProp="name">{gender}</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span className="font-medium" itemProp="name">{currentCategory?.name || 'All Products'}</span>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </div>
          </nav>

          <div className="container-custom py-8">
            {/* Header */}
            <header>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-3xl font-semibold md:text-4xl"
              >
                {currentCategory?.name || 'All Products'}
              </motion.h1>
              {currentCategory?.description && (
                <p className="mt-2 text-muted-foreground">{currentCategory.description}</p>
              )}
            </header>

            {/* Filters Bar */}
            <div className="my-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{sortedProducts.length}</span> products
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70" aria-label="Filter products">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filters
                </button>
                <label htmlFor="sort-select" className="sr-only">Sort by</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-0"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <section aria-labelledby="products-heading">
              <h2 id="products-heading" className="sr-only">{currentCategory?.name || 'Products'}</h2>
              <ProductGrid products={sortedProducts} />
            </section>
          </div>

          {/* Product List Schema */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;

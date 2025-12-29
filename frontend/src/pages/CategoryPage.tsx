import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { products, womenCategories, menCategories } from '@/data/products';

const CategoryPage = () => {
  // 1. Get both category and subcategory from URL
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('newest');
  
  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const categories = gender === 'women' ? womenCategories : menCategories;

  // 2. Find Category and Subcategory objects for metadata
  const currentCategory = categories.find((c) => c.slug === category);
  
  // If your data structure has nested subcategories inside the category object:
  const currentSubcategory = currentCategory?.subcategories?.find(
    (sub: any) => sub.slug === subcategory
  );

  const displayName = currentSubcategory?.name || currentCategory?.name || 'Products';

  // 3. Optimized Product Filtering
  const sortedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.gender === gender);

    if (category === 'new') {
      filtered = filtered.filter((p) => p.isNew);
    } else if (category && category !== 'all') {
      // Filter by main category
      filtered = filtered.filter((p) => p.category === category);
      
      // New: Filter by subcategory if it exists in the URL
      if (subcategory) {
        filtered = filtered.filter((p) => p.subcategory === subcategory);
      }
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [gender, category, subcategory, sortBy]);

  // 4. Update Breadcrumb Schema for SEO
  const breadcrumbElements = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jade-intimo.com' },
    { '@type': 'ListItem', position: 2, name: gender.charAt(0).toUpperCase() + gender.slice(1), item: `https://jade-intimo.com/${gender}` },
    { '@type': 'ListItem', position: 3, name: currentCategory?.name || 'All', item: `https://jade-intimo.com/${gender}/${category}` },
  ];

  if (subcategory && currentSubcategory) {
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 4,
      name: currentSubcategory.name,
      item: `https://jade-intimo.com/${gender}/${category}/${subcategory}`,
    });
  }

  return (
    <>
      <SEO
        title={displayName}
        description={`Shop ${displayName.toLowerCase()} at Jade Intimo.`}
        url={`https://jade-intimo.com/${gender}/${category}${subcategory ? `/${subcategory}` : ''}`}
        schema={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbElements }}
      />
      
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-[105px]">
          {/* Breadcrumbs UI */}
          <nav className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <ChevronRight size={14} />
                <li><Link to={`/${gender}`} className="capitalize hover:text-foreground">{gender}</Link></li>
                <ChevronRight size={14} />
                {/* Main Category Link */}
                <li>
                  <Link 
                    to={`/${gender}/${category}`} 
                    className={`${!subcategory ? 'font-medium text-foreground' : 'hover:text-foreground'}`}
                  >
                    {currentCategory?.name || 'Products'}
                  </Link>
                </li>
                {/* Conditional Subcategory Link */}
                {subcategory && (
                  <>
                    <ChevronRight size={14} />
                    <li className="font-medium text-foreground">{currentSubcategory?.name || subcategory}</li>
                  </>
                )}
              </ol>
            </div>
          </nav>

          <div className="container-custom py-8">
            <header>
              <motion.h1 
                key={displayName}
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="font-heading text-3xl font-semibold md:text-4xl"
              >
                {displayName}
              </motion.h1>
              <p className="mt-2 text-muted-foreground">
                {currentCategory?.description || `Explore our latest ${displayName.toLowerCase()}.`}
              </p>
            </header>

            {/* Filters Bar */}
            <div className="my-8 flex items-center justify-between border-b border-border pb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{sortedProducts.length}</span> products
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-medium">
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                </select>
              </div>
            </div>

            <ProductGrid products={sortedProducts} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;
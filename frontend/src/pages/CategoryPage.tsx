import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import SEO from '@/components/SEO';
import { womenCategories, menCategories } from '@/data/products';

const CategoryPage = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const location = useLocation();
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter States
  const [sortBy, setSortBy] = useState('newest');
  
  // Data & Pagination States
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const gender = location.pathname.startsWith('/women') ? 'women' : 'men';
  const categories = gender === 'women' ? womenCategories : menCategories;
  const currentCategory = categories.find((c) => c.slug === category);

  // Reset page to 1 if the category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, sortBy, gender]);

  // Main Data Fetching Effect
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      // Filters
      if (category && category !== 'all') params.append('category', category);
      if (subcategory) params.append('subCategory', subcategory);
      params.append('gender', gender);
      params.append('sortBy', sortBy);
      
      // Pagination Params
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      try {
        const response = await fetch(`http://localhost:3000/api/products?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        // 1. Set Products (Handle backend response structure)
        setCategoryProducts(data.products || []);
        
        // 2. Set Pagination Data
        if (data.pagination) {
          setTotalItems(data.pagination.totalItems);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setCategoryProducts([]); // Fallback to empty to prevent UI crash
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
    
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }, [category, subcategory, sortBy, gender, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <SEO title={subcategory ? `${subcategory} - Jade Intimo` : `${currentCategory?.name || category} - Jade Intimo`} />
      
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-[105px]">
          {/* Breadcrumbs */}
          <nav className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <ChevronRight size={14} />
                <li className="capitalize"><Link to={`/${gender}`}>{gender}</Link></li>
                <ChevronRight size={14} />
                <li className={!subcategory ? "font-medium text-foreground" : ""}>
                  <Link to={`/${gender}/${category}`}>{currentCategory?.name || category}</Link>
                </li>
                {subcategory && (
                  <>
                    <ChevronRight size={14} />
                    <li className="font-medium text-foreground capitalize">{subcategory.replace(/-/g, ' ')}</li>
                  </>
                )}
              </ol>
            </div>
          </nav>

          <div className="container-custom py-8">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.h1 
                  key={`${category}-${subcategory}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-heading text-3xl font-semibold md:text-4xl capitalize"
                >
                  {subcategory ? subcategory.replace(/-/g, ' ') : (currentCategory?.name || category)}
                </motion.h1>
                <p className="mt-2 text-muted-foreground">
                  {currentCategory?.description || `Colecție premium de ${gender}.`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sortează</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-b border-foreground bg-transparent py-1 text-sm font-medium focus:outline-none"
                >
                  <option value="newest">Noutăți</option>
                  <option value="price-low-high">Preț: Mic - Mare</option>
                  <option value="price-high-low">Preț: Mare - Mic</option>
                  <option value="best-selling">Cele mai vândute</option>
                </select>
              </div>
            </header>

            {/* Results Info Bar */}
            <div className="my-8 flex items-center justify-between border-b border-border pb-4">
               <p className="text-sm text-muted-foreground italic">
                Afișare: <span className="font-medium text-foreground">{categoryProducts.length}</span> din <span className="font-medium text-foreground">{totalItems}</span> produse
              </p>
            </div>

            {/* Grid Area */}
            <section className="relative min-h-[400px]">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/50 pt-20 backdrop-blur-[2px]">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              )}
              
              <ProductGrid products={categoryProducts} />
              

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {/* Simple page indicator: Page 1 of 5 */}
                  <span className="text-sm font-medium">
                    Pagina {currentPage} din {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Importuri Zustand
import  useAuthStore from '@/hooks/use-authstore'; // Asigură-te că calea e corectă
import { useCartStore, CartItem } from '@/hooks/use-cartstore'; // Noul store creat mai sus

// Import your base interface
import { Product } from '@/data/products';

interface Variants {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Zustand Stores
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  // State typed strictly with Product
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variants[] | null>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // UI State
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [available, setAvailable] = useState(0);

  // 1. Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setProduct(null);
            return;
          }
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        const productData = data.product?.product || data.product; 
        const variantsData = data.product?.variants || [];

        setProduct(productData);
        setVariants(variantsData);
        
        // Reset selections
        setSelectedSize('');
        setQuantity(1);

        // Fetch Related Products logic here if needed...

      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = async () => {
    // 1. Validări
    if (variants && variants.length > 0 && !selectedSize) {
      toast.error('Te rugăm să alegi o mărime');
      return;
    }

    if (!available || available === 0) {
      toast.error('Acest produs nu este în stoc');
      return;
    }

    if (quantity > available) {
      toast.error(`Stoc insuficient. Mai sunt doar ${available} bucăți.`);
      return;
    }

    // Construim obiectul produsului pentru coș
    const cartItemToAdd: CartItem = {
      ...product,
      variantId:selectedVariantId,
      size: selectedSize,
      quantity: quantity,
    };

    // 2. Logica bifurcată: Auth vs Guest
    if (isAuthenticated) {
      // --- LOGICA PENTRU USERI LOGAȚI (API) ---
      try {
        const response = await fetch("http://localhost:3000/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            variantId: selectedVariantId,
            quantity: quantity
          }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add product to cart");
        }

        // Succes API -> Adăugăm și în Zustand pentru update instant la UI (ex: numărul din iconița de coș)
        // Alternativ, poți refetchui tot coșul de la API.
        addItem(cartItemToAdd);
        toast.success(`${product?.name} a fost adăugat în coș!`);

      } catch (error: any) {
        console.error("Cart Error:", error);
        toast.error(error.message || "A apărut o problemă. Încearcă din nou.");
      }

    } else {
      // --- LOGICA PENTRU USERI NELOGAȚI (LocalStorage via Zustand) ---
      try {
        // Funcția addItem din Zustand se ocupă de salvarea în localStorage datorită middleware-ului 'persist'
        addItem(cartItemToAdd);
        toast.success(`${product?.name} a fost adăugat în coș (Local)!`);
      } catch (error) {
        toast.error("Nu s-a putut salva în coșul local.");
      }
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Product Not Found</h1>
          <Button onClick={() => navigate('/')} className="mt-8">Back to Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-32">
      <SEO
        title={`${product.name} | Jade Intimo`}
        description={product.description || `Shop ${product.name} at Jade Intimo`}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb ... same as before */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight size={14} />
            <li><Link to={`/${product.gender}`} className="capitalize hover:text-foreground">{product.gender}</Link></li>
            <ChevronRight size={14} />
            <li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] overflow-hidden bg-secondary rounded-sm"
            >
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </motion.div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-3xl lg:text-4xl font-semibold">{product.name}</h1>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-semibold">${(Number(product.price) / 100).toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${Number(product.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description || "No description available."}
            </p>

            {/* Size Selection */}
            {variants && variants.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Alege Mărimea</h3>
                  <button className="text-sm text-muted-foreground underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {variants.map((vari) => {
                    const isOutOfStock = vari.quantity === 0;
                    return (
                      <button
                        key={vari.size}
                        onClick={() => {
                          setSelectedSize(vari.size);
                          setAvailable(vari.quantity);
                          setSelectedVariantId(vari.id);
                          setQuantity(1); // Reset quantity on size change
                        }}
                        disabled={isOutOfStock}
                        className={`min-w-[3.5rem] border px-4 py-3 text-sm font-medium transition-all 
                          ${isOutOfStock 
                            ? 'border-gray-200 text-gray-300 decoration-line-through cursor-not-allowed bg-gray-50'
                            : selectedSize === vari.size 
                              ? 'border-foreground bg-foreground text-background' 
                              : 'border-border hover:border-foreground text-foreground'
                          }
                        `}
                      >
                        {vari.size}
                      </button>
                    );
                  })}
                </div>
                {/* Stock info */}
                {selectedSize && (
                  <div className="mt-3 text-sm font-medium">
                     {available >= 5 
                       ? <span className="text-green-600">În Stoc</span> 
                       : <span className="text-orange-500">Stoc Limitat ({available})</span>
                     }
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <div className="flex items-center border border-border w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-secondary text-lg"
                >-</button>
                <span className="px-4 py-3 min-w-[3rem] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(available || 99, quantity + 1))}
                  className="px-4 py-3 hover:bg-secondary text-lg"
                >+</button>
              </div>
              
              <Button onClick={handleAddToCart} disabled={loading ? true : false} className="flex-1 h-auto py-4 text-sm font-bold uppercase">
                Adaugă în coș
              </Button>
            </div>
            
            {/* Details & Material Sections */}
            <div className="space-y-4 pt-6">
               {/* ... (restul detaliilor) */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const product = products.find((p) => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl">Product Not Found</h1>
          <p className="mt-4 text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="mt-8">
            Back to Home
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize || product.sizes?.[0]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const averageRating = product.rating || 4.5;
  const reviewCount = product.reviews?.length || 0;
  const images = product.images || [product.image];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.gender === product.gender)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} | Jade Intimo`}
        description={product.description || `Shop ${product.name} at Jade Intimo`}
        keywords={`${product.name}, ${product.category}, ${product.gender} fashion, underwear, lingerie`}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <ChevronRight size={14} />
            <li><Link to={`/${product.gender}`} className="hover:text-foreground transition-colors capitalize">{product.gender}</Link></li>
            <ChevronRight size={14} />
            <li><Link to={`/${product.gender}/${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category.replace('-', ' ')}</Link></li>
            <ChevronRight size={14} />
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] overflow-hidden bg-secondary"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
            
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square w-20 overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <span className="bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider text-background">
                  New
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-pink px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground">
                  Bestseller
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-display text-3xl lg:text-4xl">{product.name}</h1>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(averageRating) ? 'fill-pink-accent text-pink-accent' : 'text-muted-foreground'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-pink px-2 py-1 text-xs font-medium text-foreground">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider">
                  Color: <span className="font-normal normal-case">{selectedColor}</span>
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full px-4 py-2 text-sm border transition-all ${
                        selectedColor === color
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wider">Size</h3>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] border px-4 py-2 text-sm transition-all ${
                        selectedSize === size
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 text-sm uppercase tracking-wider"
              >
                Add to Cart
              </Button>
              
              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className="flex h-12 w-12 items-center justify-center border border-border hover:border-foreground transition-colors"
              >
                <Heart
                  size={20}
                  className={isLiked ? 'fill-pink-accent text-pink-accent' : ''}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield size={20} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Secure Checkout</span>
              </div>
            </div>

            {/* Product Details */}
            {product.details && (
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider">Details</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Material */}
            {product.material && (
              <div>
                <h3 className="mb-2 text-sm font-medium uppercase tracking-wider">Material</h3>
                <p className="text-sm text-muted-foreground">{product.material}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl mb-8">Customer Reviews</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {product.reviews.map((review) => (
                <article key={review.id} className="border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-secondary px-2 py-0.5 text-muted-foreground">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-pink-accent text-pink-accent' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-secondary mb-3">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-muted-foreground transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="mt-1 text-sm">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;

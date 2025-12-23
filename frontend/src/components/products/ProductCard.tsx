import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="image-zoom relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-foreground px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-background">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-pink px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-all duration-base hover:bg-background group-hover:opacity-100"
        >
          <Heart
            size={16}
            className={isLiked ? 'fill-pink-accent text-pink-accent' : 'text-foreground'}
          />
        </button>

        {/* Add to Cart Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-xs font-medium uppercase tracking-wider text-background transition-all hover:bg-foreground/90"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium transition-colors group-hover:text-muted-foreground">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const shippingCost = totalPrice > 100 ? 0 : 9.99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <>
      <SEO
        title="Shopping Cart"
        description="Review your shopping cart at Jade Intimo. Secure checkout with free shipping on orders over $100."
        url="https://jade-intimo.com/cart"
      />
      <div className="min-h-screen">
        <Navbar />
        <main role="main" className="pt-[105px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/30">
            <div className="container-custom py-4">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                <li>
                  <span className="font-medium">Shopping Cart</span>
                </li>
              </ol>
            </div>
          </nav>

          <div className="container-custom py-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl font-semibold md:text-4xl"
            >
              Your Cart
            </motion.h1>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <p className="text-lg text-muted-foreground">Your cart is empty</p>
                <Link to="/women" className="btn-primary mt-6 inline-block">
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="mt-8 grid gap-12 lg:grid-cols-3">
                {/* Cart Items */}
                <section className="lg:col-span-2" aria-labelledby="cart-items-heading">
                  <h2 id="cart-items-heading" className="sr-only">Cart Items</h2>
                  <ul className="space-y-6">
                    {items.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-6 border-b border-border pb-6"
                      >
                        {/* Product Image */}
                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.size && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                Size: {item.size}
                              </p>
                            )}
                            <p className="mt-1 font-semibold">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3" role="group" aria-label={`Quantity for ${item.name}`}>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-secondary"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} aria-hidden="true" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity: ${item.quantity}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-secondary"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} aria-hidden="true" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </section>

                {/* Order Summary */}
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-fit bg-secondary/50 p-6"
                  aria-labelledby="summary-heading"
                >
                  <h2 id="summary-heading" className="font-heading text-xl font-semibold">
                    Order Summary
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>${totalPrice.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd>
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                      </dd>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over $100
                      </p>
                    )}
                    <hr className="border-border" />
                    <div className="flex justify-between font-semibold">
                      <dt>Total</dt>
                      <dd>${finalTotal.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <Link
                    to="/checkout"
                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>

                  <Link
                    to="/women"
                    className="mt-4 block text-center text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Continue Shopping
                  </Link>
                </motion.aside>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CartPage;

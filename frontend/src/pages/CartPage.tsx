import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

// Importuri Zustand
import { useCartStore } from '@/hooks/use-cartstore';
import useAuthStore from '@/hooks/use-authstore';

const CartPage = () => {
  // 1. Accesăm starea din Zustand
  const { cart, removeItem, updateQuantity } = useCartStore(); // Asigură-te că ai adăugat updateQuantity în store (vezi nota de jos)
  const { isAuthenticated } = useAuthStore();
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Pentru loading state per item

  // 2. Calculăm totalurile derivate (Zustand nu le ține în state de obicei)
  // Presupunem că prețul vine ca Integer (ex: 15900) deci împărțim la 100
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100;
  
  const freeShippingThreshold = 100; // $100
  const shippingCost = cartTotal > freeShippingThreshold ? 0 : 9.99;
  const finalTotal = cartTotal + shippingCost;

  // 3. Handlers pentru acțiuni (Sincronizare API + Zustand)
  
  // const handleUpdateQuantity = async (variantId: string, newQuantity: number) => {
  //   if (newQuantity < 1) return;

  //   setIsUpdating(variantId);
    
  //   try {
  //     if (isAuthenticated) {
  //       // Dacă e logat, actualizăm pe server
  //       const response = await fetch('http://localhost:3000/api/cart', {
  //         method: 'PUT', // Sau PATCH, depinde de backend-ul tău
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ variantId, quantity: newQuantity }),
  //         credentials: 'include',
  //       });

  //       if (!response.ok) throw new Error('Failed to update cart');
  //     }

  //     // Actualizăm local în Zustand
  //     updateQuantity(variantId, newQuantity);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Could not update quantity");
  //   } finally {
  //     setIsUpdating(null);
  //   }
  // };

  // const handleRemoveItem = async (variantId: string) => {
  //   setIsUpdating(variantId);
  //   try {
  //     if (isAuthenticated) {
  //       // Dacă e logat, ștergem de pe server
  //       const response = await fetch(`http://localhost:3000/api/cart/${variantId}`, {
  //         method: 'DELETE',
  //         credentials: 'include',
  //       });

  //       if (!response.ok) throw new Error('Failed to remove item');
  //     }

  //     // Ștergem local din Zustand
  //     removeItem(variantId);
  //     toast.success("Item removed");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Could not remove item");
  //   } finally {
  //     setIsUpdating(null);
  //   }
  // };

  return (
    <>
      <SEO
        title="Shopping Cart"
        description="Review your shopping cart at Jade Intimo."
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

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                   <Trash2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/women" className="btn-primary mt-8 inline-block px-8">
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="mt-8 grid gap-12 lg:grid-cols-3">
                {/* Cart Items List */}
                <section className="lg:col-span-2" aria-labelledby="cart-items-heading">
                  <h2 id="cart-items-heading" className="sr-only">Cart Items</h2>
                  <ul className="space-y-6">
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.li
                          key={item.variantId} // Folosim variantId ca cheie unică
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-6 border-b border-border pb-6 relative"
                        >
                          {/* Loading Overlay per item */}
                          {isUpdating === item.variantId && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                              <Loader2 className="animate-spin text-foreground" />
                            </div>
                          )}

                          {/* Product Image */}
                          <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
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
                              <div className="flex justify-between">
                                <h3 className="font-heading font-medium text-lg">
                                    <Link to={`/product/${item.id}`} className="hover:underline">
                                        {item.name}
                                    </Link>
                                </h3>
                                <p className="font-semibold">
                                  ${((item.price * item.quantity) / 100).toFixed(2)}
                                </p>
                              </div>
                              
                              {item.size && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Size: <span className="text-foreground">{item.size}</span>
                                </p>
                              )}
                              <p className="mt-1 text-sm text-muted-foreground">
                                Unit Price: ${(item.price / 100).toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-border rounded-sm">
                                <button
                                  // onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  // onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                //onClick={() => handleRemoveItem(item.variantId)}
                                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-red-500"
                              >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </section>

                {/* Order Summary */}
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-fit rounded-lg border border-border bg-secondary/20 p-6 shadow-sm"
                  aria-labelledby="summary-heading"
                >
                  <h2 id="summary-heading" className="font-heading text-xl font-semibold">
                    Order Summary
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>${cartTotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                      </dd>
                    </div>
                    
                    {shippingCost > 0 ? (
                      <div className="rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                        Add <strong>${(freeShippingThreshold - cartTotal).toFixed(2)}</strong> more for free shipping.
                      </div>
                    ) : (
                      <div className="rounded-md bg-green-50 p-2 text-xs text-green-700">
                        You're eligible for <strong>Free Shipping</strong>!
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-end">
                            <dt className="text-base font-semibold">Total</dt>
                            <dd className="text-xl font-bold">${finalTotal.toFixed(2)}</dd>
                        </div>
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                            Tax included.
                        </p>
                    </div>
                  </dl>

                  <Link
                    to="/checkout"
                    className="btn-primary mt-8 flex w-full items-center justify-center gap-2 py-4 text-base font-semibold shadow-md hover:shadow-lg"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/women"
                    className="mt-6 block text-center text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
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
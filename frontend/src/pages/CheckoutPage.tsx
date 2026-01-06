import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check, CreditCard, Truck, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

// 1. Import Zustand Store instead of Context
import { useCartStore } from '@/hooks/use-cartstore';

type Step = 'shipping' | 'payment' | 'review';

const CheckoutPage = () => {
  // 2. Use Zustand hooks
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // 3. Calculate Totals Locally (since Zustand stores raw data)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100;
  const shippingCost = cartTotal > 100 ? 0 : 9.99;
  const finalTotal = cartTotal + shippingCost;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'shipping', label: 'Shipping', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: Check },
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // NOTE: Here you would ideally make a POST request to your backend to create the order
    // e.g., await fetch('/api/orders', { method: 'POST', body: ... })

    // Simulate order processing for now
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    clearCart(); // Clear Zustand store
    toast.success('Order placed successfully!');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center pt-[105px]">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-semibold">Your cart is empty</h1>
            <Link to="/women" className="btn-primary mt-6 inline-block">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-[105px]">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-secondary/30">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <Link to="/cart" className="text-muted-foreground transition-colors hover:text-foreground">
                Cart
              </Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="font-medium">Checkout</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-12">
          {/* Progress Steps */}
          <div className="mb-12 flex justify-center">
            <div className="flex items-center gap-4 md:gap-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.key === currentStep;
                const isCompleted = steps.findIndex((s) => s.key === currentStep) > index;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? 'bg-foreground text-background'
                            : isCompleted
                            ? 'bg-pink text-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                      </div>
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden h-[1px] w-12 md:block ${
                          isCompleted ? 'bg-pink' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Shipping Form */}
              {currentStep === 'shipping' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleShippingSubmit}
                  className="space-y-6"
                >
                  <h2 className="font-heading text-2xl font-semibold">
                    Shipping Information
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, email: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, phone: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium">City</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">State</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, state: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    Continue to Payment
                  </button>
                </motion.form>
              )}

              {/* Payment Form */}
              {currentStep === 'payment' && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-6"
                >
                  <h2 className="font-heading text-2xl font-semibold">
                    Payment Information
                  </h2>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                      }
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentInfo.expiry}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, expiry: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">CVV</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                        }
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary">
                      Review Order
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Review Step */}
              {currentStep === 'review' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h2 className="font-heading text-2xl font-semibold">
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="border border-border p-6">
                    <div className="flex items-center gap-3">
                      <Truck size={20} />
                      <h3 className="font-medium">Shipping Address</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {shippingInfo.firstName} {shippingInfo.lastName}
                      <br />
                      {shippingInfo.address}
                      <br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      <br />
                      {shippingInfo.email}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-border p-6">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} />
                      <h3 className="font-medium">Payment Method</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Card ending in ****{paymentInfo.cardNumber.slice(-4)}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="border border-border p-6">
                    <h3 className="font-medium">Order Items</h3>
                    <div className="mt-4 space-y-4">
                      {cart.map((item) => (
                        <div key={item.variantId} className="flex gap-4">
                          <div className="h-16 w-12 overflow-hidden bg-secondary">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.size && (
                                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          {/* Price formatting fixed */}
                          <p className="text-sm font-medium">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="sticky top-32 bg-secondary/50 p-6">
                <h2 className="font-heading text-xl font-semibold">Order Summary</h2>

                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="h-16 w-12 overflow-hidden bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      {/* Price formatting fixed */}
                      <p className="text-sm font-medium">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="my-6 border-border" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/hooks/use-cartstore';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const finalizeOrder = async () => {
      if (!sessionId) return;

      // 1. Retrieve the saved data
      const storedOrder = localStorage.getItem('pending_order_data');
      if (!storedOrder) {
        setStatus('error');
        toast.error("Order data lost. Please contact support.");
        return;
      }

      const orderData = JSON.parse(storedOrder);

      try {
        // 2. Call API to verify payment AND place order
        const res = await fetch("http://localhost:3000/api/order/place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            ...orderData,
            stripe_session_id: sessionId
          }),
        });

        if (!res.ok) throw new Error("Order creation failed");

        // 3. Cleanup
        localStorage.removeItem('pending_order_data');
        clearCart();
        setStatus('success');
        
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    // Run once on mount
    finalizeOrder();
  }, [sessionId]);

  if (status === 'verifying') return <div>Verifying your payment...</div>;
  if (status === 'error') return <div>Something went wrong. Please contact support.</div>;

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
      <p>Thank you for your purchase.</p>
      <button onClick={() => navigate('/')} className="btn-primary mt-4">
        Back to Home
      </button>
    </div>
    <Footer/>
    </>
  );
};

export default SuccessPage;
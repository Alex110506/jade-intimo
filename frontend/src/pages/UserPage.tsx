import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, MapPin, Package, Edit2, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/hooks/use-authstore.ts";
import { useCartStore } from "@/hooks/use-cartstore.ts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button"; 

// Mock data for orders
const MOCK_ORDERS = [
  { id: "ORD-92831", date: "2025-11-12", status: "Delivered", total: 245.00 },
  { id: "ORD-88210", date: "2025-12-05", status: "Processing", total: 120.50 },
];

const UserPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Zustand State
  const { user, address, setAddress, clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Romania",
  });

  // Sync form with existing address data
  useEffect(() => {
    if (address) {
      setAddressForm({
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      });
    }
  }, [address]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");

      clearAuth();
      clearCart();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error("Could not log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);

    // 1. Determine Logic: CREATE (POST) vs UPDATE (PUT)
    const isExisting = !!address; // If address is not null, it exists
    const endpoint = isExisting ? "updateAddress" : "addAddress";
    const method = isExisting ? "PUT" : "POST";

    try {
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save address");
      }
      
      // 2. Update Zustand State
      // Backend should return: { message: "...", address: { ... } }
      setAddress(data.address);
      
      setIsEditingAddress(false);
      toast.success(isExisting ? "Address updated successfully" : "Address created successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <main className="container-custom py-24 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile & Address */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-pink/20 flex items-center justify-center text-pink-accent font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-semibold">My Account</h1>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 text-sm text-red-600 hover:bg-red-50 border border-red-100 transition-colors rounded-md font-medium"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut size={16} />}
                Logout
              </button>
            </div>

            {/* Address Card */}
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-muted-foreground" />
                  <h2 className="font-semibold">Shipping Address</h2>
                </div>
                {!isEditingAddress && address && (
                  <button onClick={() => setIsEditingAddress(true)} className="text-xs text-pink-accent hover:underline flex items-center gap-1">
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {isEditingAddress || !address ? (
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <input
                    placeholder="Address Line"
                    className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent"
                    value={addressForm.address_line}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="City"
                      className="text-sm border border-border p-2 rounded focus:outline-pink-accent"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                    <input
                      placeholder="State/County"
                      className="text-sm border border-border p-2 rounded focus:outline-pink-accent"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    placeholder="Postal Code"
                    className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSavingAddress} className="flex-1 text-xs py-2 h-auto">
                      {isSavingAddress ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={14} className="mr-1" />}
                      Save Address
                    </Button>
                    {address && (
                      <button type="button" onClick={() => setIsEditingAddress(false)} className="px-3 text-xs border border-border rounded hover:bg-secondary">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-foreground font-medium">{address.address_line}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.postal_code}</p>
                  <p>{address.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm min-h-[400px]">
              <div className="flex items-center gap-2 mb-6">
                <Package size={20} className="text-muted-foreground" />
                <h2 className="text-xl font-semibold">Order History</h2>
              </div>

              {MOCK_ORDERS.length > 0 ? (
                <div className="space-y-4">
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:border-pink/50 transition-colors gap-4">
                      <div>
                        <p className="text-xs font-bold text-pink-accent uppercase tracking-tighter">{order.id}</p>
                        <p className="text-sm font-medium mt-1">Placed on {order.date}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package size={48} className="text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/women')} className="mt-4 text-pink-accent font-medium hover:underline">
                    Go shopping
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/hooks/use-authstore.ts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const UserPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get the actions from your Zustand store
  const setUser = useAuthStore((state: any) => state.setUser);
  const user = useAuthStore((state: any) => state.user);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Essential to send the cookie to the backend to be cleared
      });

      if (!response.ok) throw new Error("Logout failed");

      // 1. Clear Zustand state
      setUser(null);

      // 2. Feedback and Redirect
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error("Could not log out. Please try again.");
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="container-custom py-20 mt-16">
          <div className="max-w-md mx-auto bg-white p-8 border border-border rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
            <p className="text-muted-foreground mb-6">
              Manage your account settings and orders.
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-secondary/30 rounded-md">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Email Address
                </p>
                <p className="text-sm font-medium">{user?.email || "N/A"}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors rounded-md font-medium"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;

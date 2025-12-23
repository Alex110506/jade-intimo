import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center pt-[105px]">
        <div className="container-custom py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md"
          >
            <div className="text-center">
              <h1 className="font-heading text-3xl font-semibold">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {isLogin
                  ? 'Sign in to access your account'
                  : 'Join us for exclusive offers and updates'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
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
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border bg-transparent px-4 py-3 pr-12 text-sm focus:border-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 border border-border" />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="relative">
                <hr className="border-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
                  or
                </span>
              </div>

              <button
                type="button"
                className="btn-secondary flex w-full items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

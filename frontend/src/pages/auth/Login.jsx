import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Car, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login, loading, error, clearError } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      let redirectPath = from;
      if (redirectPath === '/admin' && data.user.role !== 'admin') {
        redirectPath = '/';
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-dark">
      {/* Left side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-white/50 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="relative z-20 p-20 self-end max-w-xl">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/40">
            <Car size={32} className="text-white" />
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight text-text-main">Elevate Your Journey with <span className="text-primary">LuxeDrive</span></h2>
          <p className="text-xl text-text-main font-medium">Experience the pinnacle of luxury car rental with our exclusive fleet and premium service.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-3 tracking-tight text-text-main">Welcome Back</h1>
            <p className="text-text-dim">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-shake shadow-sm">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value });
                    if (error) clearError();
                  }}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-text-main">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline font-bold">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (error) clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-4 text-lg rounded-xl group shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-text-dim">
            Don't have an account? {' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

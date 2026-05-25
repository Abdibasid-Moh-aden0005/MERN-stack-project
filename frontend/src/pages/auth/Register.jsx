import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Car, AlertCircle, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    licenseExpiry: '',
  });
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Basic client side check
      return;
    }
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
      });
      navigate('/');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-dark">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-white/50 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="relative z-20 p-20 self-end max-w-xl">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/40">
            <Car size={32} className="text-white" />
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight text-text-main">Join the Elite Circle of <span className="text-primary">LuxeDrive</span></h2>
          <p className="text-xl text-text-main font-medium">Experience a new standard of luxury mobility. Sign up today and unlock exclusive access.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-md space-y-8 py-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-3 tracking-tight text-text-main">Create Account</h1>
            <p className="text-text-dim">Get started with your luxury rental journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <User size={20} /> Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <MapPin size={20} /> Address Information
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main ml-1">Street Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Way"
                    className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">City</label>
                  <input 
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">State</label>
                  <input 
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Zip</label>
                  <input 
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <CreditCard size={20} /> License Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">License Number</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="ABC123456"
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Expiry Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="date"
                      name="licenseExpiry"
                      value={formData.licenseExpiry}
                      onChange={handleChange}
                      className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Lock size={20} /> Security
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white border border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-main ml-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white border border-border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main placeholder:text-text-dim shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-4 text-lg rounded-xl group mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              Create Account <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-text-dim pb-8">
            Already have an account? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

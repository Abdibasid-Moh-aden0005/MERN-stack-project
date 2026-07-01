import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCarStore from '../../store/zustand/cars';
import useAuthStore from '../../store/zustand/auth';
import HeroSection from '../../components/customer/HeroSection';
import SearchBar from '../../components/customer/SearchBar';
import FleetGrid from '../../components/customer/FleetGrid';
import CTASection from '../../components/customer/CTASection';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, loading } = useCarStore();
  const { isAuthenticated } = useAuthStore();
  const fetchCars = useCarStore((state) => state.fetchCars);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const filteredCars = cars.filter((car) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      car.name.toLowerCase().includes(term) ||
      car.brand.toLowerCase().includes(term) ||
      car.model?.toLowerCase().includes(term)
    );
  });

  const handleBookNow = (car) => {
    if (!isAuthenticated) {
      toast.info("Login first to book a car", { position: "top-right", autoClose: 3000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light" });
      navigate('/login', { state: { from: location } });
    } else {
      navigate(`/cars/${car._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      <HeroSection />
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FleetGrid cars={filteredCars} loading={loading} onBookNow={handleBookNow} />
      <CTASection />
    </div>
  );
};

export default Home;

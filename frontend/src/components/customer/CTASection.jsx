import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 mt-32 max-w-[1440px]">
      <div className="relative rounded bg-bg-sidebar p-12 md:p-24 text-center space-y-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <h2 className="text-3xl md:text-5xl font-black text-white relative z-10 leading-tight">
          READY TO START <br /> YOUR JOURNEY?
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto relative z-10">
          Join thousands of satisfied drivers and experience the best luxury car rental service in the world.
        </p>
        <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary px-10 py-4 text-base shadow-lg shadow-primary/20"
          >
            Sign Up Now
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-bg-sidebar rounded font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Member Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

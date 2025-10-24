

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HERO_SLIDES = [
  {
    bg: "https://t4.ftcdn.net/jpg/11/86/98/73/360_F_1186987302_D2tBFilH4Slm3EPv3Tf86tvflrDmQcBG.jpg",
    label: "New Arrivals",
    title: "Elevate Your Style: Discover the Latest Trends in Fashion",
    desc: "Step into the season with confidence. Explore our curated collection of premium clothing for every occasion—crafted for comfort, designed for you.",
  },
  {
    bg: "https://www.orientbell.com/blog/wp-content/uploads/2024/04/850x450-Pix_16-1.jpg",
    label: "Modern Storefront",
    title: "Experience Shopping Redefined: Visit Our Stunning New Showroom",
    desc: "Discover a space where inspiration meets innovation. Our latest store design blends elegance and comfort—making every visit memorable.",
  },
  {
    bg: "https://www.shutterstock.com/image-photo/pasay-metro-manila-philippines-nov-600nw-2576427105.jpg",
    label: "Fashion Event",
    title: "Live the Glamour: Unveiling Our Latest Collection on the Runway",
    desc: "Be part of the excitement! Experience the energy of our exclusive fashion event, where bold designs and vibrant styles take center stage.",
  },
];

const SLIDE_INTERVAL = 6000; // ms

const Hero = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeTimeout: NodeJS.Timeout = setTimeout(() => setFade(true), 80); // Fade-in after short delay
    setFade(false); // Start fade-out
    const timer: NodeJS.Timeout = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSlide((s) => (s + 1) % HERO_SLIDES.length);
        setFade(true);
      }, 500); // match fade duration
    }, SLIDE_INTERVAL);
    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimeout);
    };
  }, []);

  // Manual slide change (for indicators)
  const goToSlide = (idx: number) => {
    if (idx === slide) return;
    setFade(false);
    setTimeout(() => {
      setSlide(idx);
      setFade(true);
    }, 500);
  };

  return (
  <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background images crossfade */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full bg-center bg-cover pointer-events-none transition-opacity duration-700 ${slide === idx ? (fade ? 'opacity-100 z-10' : 'opacity-0 z-10') : 'opacity-0 z-0'}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url('${s.bg}')`,
            willChange: 'opacity',
          }}
        />
      ))}
  <div className="container relative z-20 mx-auto px-2 sm:px-4 flex flex-col items-center justify-center text-center">
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-auto transition-opacity duration-700 ${slide === idx ? (fade ? 'opacity-100 z-20' : 'opacity-0 z-20') : 'opacity-0 z-0'} pointer-events-none`}
            style={{ willChange: 'opacity' }}
          >
            <div className="text-white space-y-4 sm:space-y-6 py-10 sm:py-16 md:py-20 lg:py-32 px-2 sm:px-0">
              <p className="text-xs sm:text-sm uppercase tracking-widest font-light">{s.label}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                {s.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                {s.desc}
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="uppercase tracking-wider font-semibold mt-4 pointer-events-auto w-full sm:w-auto"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </Button>
            </div>
          </div>
        ))}
        {/* Slide indicators removed as per user request */}
      </div>
    </div>
  );
};

export default Hero;

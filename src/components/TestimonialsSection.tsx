import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TestimonialsSection = () => {
  const testimonials = [
    { id: 1, name: "Ayesha Khan", rating: 5, text: "Absolutely loved the quality and fit! Will definitely order again. Highly recommended for everyone in Pakistan." },
    { id: 2, name: "Ali Raza", rating: 5, text: "Fast delivery and the product is exactly as shown. Great experience shopping here!" },
    { id: 3, name: "Fatima Tariq", rating: 5, text: "The fabric is so soft and comfortable. My friends keep asking where I got it from!" },
    { id: 4, name: "Usman Javed", rating: 4, text: "Good value for money. Customer service was very helpful and responsive." },
    { id: 5, name: "Hira Sheikh", rating: 5, text: "Stylish and trendy! I wore it to a family event and got so many compliments." },
    { id: 6, name: "Bilal Ahmed", rating: 5, text: "Perfect for Karachi weather. Breathable and light. Will buy more soon." },
    { id: 7, name: "Sana Malik", rating: 5, text: "Loved the packaging and the little thank you note. Shows you care about your customers!" },
    { id: 8, name: "Zainab Noor", rating: 5, text: "Fits perfectly and the stitching is top notch. Highly satisfied!" },
    { id: 9, name: "Hamza Siddiqui", rating: 4, text: "Nice collection. Would love to see more colors in the future." },
    { id: 10, name: "Rabia Shamsher", rating: 5, text: "Received my parcel in Lahore within 2 days. Super fast!" },
  ];

  // Marquee logic
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const speed = 1.1; // px per frame

  // Duplicate testimonials for seamless loop
  const marqueeList = [...testimonials, ...testimonials];

  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (!paused && marqueeRef.current) {
        setOffset((prev) => {
          // Width of one set of reviews
          const singleWidth = marqueeRef.current!.scrollWidth / 2;
          let next = prev + speed;
          if (next >= singleWidth) next = 0;
          return next;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  // Pause on hover
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-x-hidden">
          <div
            ref={marqueeRef}
            className="flex gap-8 pb-2"
            style={{
              transform: `translateX(-${offset}px)`,
              transition: paused ? 'none' : 'transform 0.1s linear',
              cursor: 'grab',
              userSelect: 'none',
              width: 'max-content',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {marqueeList.map((testimonial, idx) => (
              <div
                key={idx + '-' + testimonial.id}
                className="flex-none w-[320px] sm:w-[360px] md:w-[400px] bg-background p-8 rounded-lg shadow-sm snap-start transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <p className="font-semibold text-sm uppercase tracking-wider">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-muted-foreground">Hover over reviews to pause scrolling</div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

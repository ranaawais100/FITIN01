import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Users, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">About FITIN</h1>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground font-medium">
              At FITIN, we believe fashion is more than style — it’s confidence. Our mission is to design modern, comfortable, and sustainable apparel that fits every personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="p-8 bg-muted/10 rounded-2xl shadow-xl text-center flex flex-col items-center">
              <Target className="mb-4 h-10 w-10 text-primary" />
              <h3 className="font-bold text-xl mb-2">Our Mission</h3>
              <p className="text-base text-muted-foreground">
                To create clothing that empowers people to feel confident in everyday life while minimizing environmental impact.
              </p>
            </div>
            <div className="p-8 bg-muted/10 rounded-2xl shadow-xl text-center flex flex-col items-center">
              <BookOpen className="mb-4 h-10 w-10 text-primary" />
              <h3 className="font-bold text-xl mb-2">Our Vision</h3>
              <p className="text-base text-muted-foreground">
                A world where premium, sustainable fashion is accessible and celebrates individuality.
              </p>
            </div>
            <div className="p-8 bg-muted/10 rounded-2xl shadow-xl text-center flex flex-col items-center">
              <Users className="mb-4 h-10 w-10 text-primary" />
              <h3 className="font-bold text-xl mb-2">Our Values</h3>
              <p className="text-base text-muted-foreground">
                Quality, sustainability, inclusivity, and timeless design.
              </p>
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="max-w-3xl mx-auto text-center text-lg text-muted-foreground font-medium">
              FITIN began as a small studio dedicated to crafting garments that marry comfort with contemporary style. Over the years, we've grown into a brand that values responsible production and thoughtful design. What sets us apart is our commitment to creating pieces that people reach for time and again.
            </div>
          </section>

          <div className="text-center mt-12">
            <p className="mb-4 text-lg text-muted-foreground font-medium">
              Explore our full collection and find what fits you best.
            </p>
            <Button 
              onClick={() => navigate('/products')} 
              className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

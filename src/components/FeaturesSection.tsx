import { Truck, Package, RotateCcw } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your beauty essentials delivered quickly to your doorstep with our expedited shipping options.",
    },
    {
      id: 2,
      icon: Package,
      title: "Free Shipping",
      description:
        "Enjoy complimentary shipping on all orders over $50. No hidden fees, just premium products delivered free.",
    },
    {
      id: 3,
      icon: RotateCcw,
      title: "Easy Returns",
      description:
        "Not satisfied? Return any product within 30 days for a full refund. Your satisfaction is our priority.",
    },
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            Why Choose Us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

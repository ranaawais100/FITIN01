const LogoCarousel = () => {
  const logos = [
    "LOGOIPSUM",
    "logoipsum",
    "LOGOIPSUM",
    "logoipsum",
    "LOGOIPSUM",
    "logoipsum",
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;

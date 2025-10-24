import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Please enter your name.";
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.message) errs.message = "Please enter your message.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
  <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a]">
      <Header />
      {/* Hero Section */}
  <section className="w-full py-16 bg-gradient-to-br from-[#ffffff] via-[#f8f9fa] to-[#e6e6e6] relative border-b border-[#e6e6e6]">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0a1f44]">We’re Here to Help</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#caa86b] mb-2">
            Have a question, need help with an order, or just want to say hello? Reach out to our team — we’d love to hear from you.
          </p>
        </div>
  <div className="absolute inset-0 bg-[#f8f9fa]/60 pointer-events-none" />
      </section>

      {/* Contact Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#ffffff] rounded-2xl shadow-xl border border-[#e6e6e6] p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-2 text-[#0a1f44]">Contact Us</h2>
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fa] text-[#1a1a1a] border border-[#e6e6e6] shadow focus:ring-2 focus:ring-[#0a1f44]"
              />
              {errors.name && <p className="text-sm text-[#caa86b] mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fa] text-[#1a1a1a] border border-[#e6e6e6] shadow focus:ring-2 focus:ring-[#0a1f44]"
              />
              {errors.email && <p className="text-sm text-[#caa86b] mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fa] text-[#1a1a1a] border border-[#e6e6e6] shadow focus:ring-2 focus:ring-[#0a1f44]"
              />
            </div>
            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[#f8f9fa] text-[#1a1a1a] border border-[#e6e6e6] shadow focus:ring-2 focus:ring-[#0a1f44]"
              />
              {errors.message && <p className="text-sm text-[#caa86b] mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-lg bg-[#0a1f44] text-[#f8f9fa] shadow-lg border border-[#e6e6e6] hover:bg-[#caa86b] hover:text-[#1a1a1a] hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#caa86b]"
            >
              Send Message
            </button>
            {success && (
              <div className="mt-2 text-center text-[#caa86b] font-semibold animate-fade-in">
                Your message has been sent successfully! Our team will get back to you shortly.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#f8f9fa] rounded-2xl shadow-lg border border-[#e6e6e6] p-8 flex flex-col items-center text-center">
            <MapPin className="h-7 w-7 mb-2 text-[#caa86b]" />
            <h3 className="font-bold mb-1 text-[#0a1f44]">Address</h3>
            <p className="text-[#1a1a1a]">123 Fashion Street, Lahore, Pakistan</p>
          </div>
          <div className="bg-[#f8f9fa] rounded-2xl shadow-lg border border-[#e6e6e6] p-8 flex flex-col items-center text-center">
            <Phone className="h-7 w-7 mb-2 text-[#caa86b]" />
            <h3 className="font-bold mb-1 text-[#0a1f44]">Phone</h3>
            <p className="text-[#1a1a1a]">+92 300 1234567</p>
          </div>
          <div className="bg-[#f8f9fa] rounded-2xl shadow-lg border border-[#e6e6e6] p-8 flex flex-col items-center text-center">
            <Mail className="h-7 w-7 mb-2 text-[#caa86b]" />
            <h3 className="font-bold mb-1 text-[#0a1f44]">Email</h3>
            <p className="text-[#1a1a1a]">support@fitin.com</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 flex gap-6 justify-center">
          <a href="https://instagram.com" target="_blank" rel="noopener" className="hover:shadow-[0_0_10px_2px_#caa86b] transition-all rounded-full p-2">
            <Instagram className="h-7 w-7 text-[#0a1f44]" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener" className="hover:shadow-[0_0_10px_2px_#0a1f44] transition-all rounded-full p-2">
            <Facebook className="h-7 w-7 text-[#0a1f44]" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener" className="hover:shadow-[0_0_10px_2px_#caa86b] transition-all rounded-full p-2">
            <Youtube className="h-7 w-7 text-[#0a1f44]" />
          </a>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-2xl h-64 rounded-2xl overflow-hidden shadow-lg border border-[#e6e6e6] relative">
            <iframe
              title="FITIN Location"
              src="https://www.google.com/maps?q=31.5497,74.3436&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ filter: "grayscale(1) brightness(0.9)" }}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-none"
            />
            <div className="absolute inset-0 bg-[#f8f9fa]/60 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-lg text-[#1a1a1a]">Prefer to shop instead? Explore our latest collection.</p>
          <Link to="/products">
            <button className="px-8 py-4 bg-[#0a1f44] text-[#f8f9fa] rounded-xl font-bold text-lg shadow-lg border border-[#e6e6e6] hover:bg-[#caa86b] hover:text-[#1a1a1a] hover:underline transition-all duration-200">
              Shop All
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;

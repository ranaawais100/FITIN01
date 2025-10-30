import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm("service_y74axjg", "template_owner_notify", form.current, "EMY6w-vmWX9di5A9N")
        .then(
          () => {
            toast.success("Your message has been sent successfully!");
            form.current?.reset();
          },
          (error) => {
            console.error("FAILED...", error.text || error);
            toast.error("Failed to send message. Please try again later.");
          }
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <p className="text-center text-muted-foreground mb-8">
            Have questions or feedback? Fill out the form below to get in touch with us.
          </p>
          <form ref={form} onSubmit={sendEmail} className="space-y-6 bg-background p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input id="user_name" type="text" name="user_name" placeholder="Your Full Name" className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="user_email" type="email" name="user_email" placeholder="Your Email Address" className="w-full p-2 border rounded" required />
              </div>
            </div>
            <div>
              <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input id="user_phone" type="text" name="user_phone" placeholder="Your Phone Number" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" name="message" placeholder="Your Message" className="w-full p-2 border rounded" rows={4} required></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

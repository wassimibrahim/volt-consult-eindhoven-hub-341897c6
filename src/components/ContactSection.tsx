import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would normally send the data to your server or API
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      organization: '',
      message: ''
    });
    
    // Show success message
    alert('Your message has been sent! We will get back to you soon.');
  };

  return (
    <section id="contact" className="section-padding bg-volt-gray">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-volt-red/10 text-volt-red rounded-full">
              Contact Us
            </span>
            
            <h2 className="heading-lg text-volt-dark mb-6">
              Get in Touch
            </h2>
            
            <p className="text-lg text-volt-text/80 leading-relaxed mb-8">
              We'd love to hear from you! Reach out to us for inquiries, collaboration opportunities, or to discuss your project needs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-volt-red/10 flex items-center justify-center text-volt-red flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-volt-text/80">eindhoven@voltconsultingroup.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-volt-red/10 flex items-center justify-center text-volt-red flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-volt-text/80">Eindhoven University of Technology, Eindhoven, Netherlands</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-volt-red/10 flex items-center justify-center text-volt-red flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-volt-text/80">+31613838880</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="heading-sm mb-4 text-volt-dark">Upcoming Dates</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-volt-red/10">
                  <span className="font-medium">Recruitment Cycle Opens</span>
                  <span className="text-volt-red">June 01, 2025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="heading-sm mb-6 text-volt-dark">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-volt-gray focus:border-volt-red focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-volt-gray focus:border-volt-red focus:outline-none transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block mb-2 font-medium">
                    Organization (Optional)
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-volt-gray focus:border-volt-red focus:outline-none transition-colors"
                    placeholder="Your company or institution"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-volt-gray focus:border-volt-red focus:outline-none transition-colors resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="button-primary w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

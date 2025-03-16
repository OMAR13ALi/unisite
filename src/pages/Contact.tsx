
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ContactForm from '@/components/ui/ContactForm';
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              Contact
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              I welcome messages from colleagues, students, and industry partners.
              Feel free to reach out using the form below or my contact information.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Contact Information */}
              <div className="md:col-span-1 animate-slide-up">
                <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
                  <h2 className="text-2xl font-serif font-medium mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <Mail size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">
                          <a href="mailto:john.smith@university.edu" className="hover-underline-animation">
                            john.smith@university.edu
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <MapPin size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-1">Office Address</h3>
                        <p className="text-muted-foreground">
                          Computer Science Building<br />
                          Room 3.42<br />
                          123 University Avenue<br />
                          City, State 12345
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <Clock size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold mb-1">Office Hours</h3>
                        <p className="text-muted-foreground">
                          Monday: 2:00 PM - 4:00 PM<br />
                          Thursday: 10:00 AM - 12:00 PM<br />
                          Or by appointment
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold mb-2">Social Media</h3>
                      <div className="flex space-x-4">
                        <a 
                          href="https://twitter.com/example" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter size={20} />
                        </a>
                        <a 
                          href="https://linkedin.com/in/example" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={20} />
                        </a>
                        <a 
                          href="https://github.com/example" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-secondary transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-2xl font-serif font-medium mb-6">Send a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;

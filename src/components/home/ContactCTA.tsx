
import React from 'react';
import { Link } from 'react-router-dom';

const ContactCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interested in collaboration, speaking engagements, or student opportunities? 
            I welcome messages from colleagues, students, and industry partners.
          </p>
          <Link 
            to="/contact" 
            className="px-8 py-4 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90 inline-block"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

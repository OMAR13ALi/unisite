import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ProfessorProfile {
  first_name?: string;
  last_name?: string;
  title?: string;
}

interface HeroProps {
  professor?: ProfessorProfile;
}

const Hero: React.FC<HeroProps> = ({ professor }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center py-12">
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-secondary/40 to-transparent" 
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              {professor ? `${professor.first_name} ${professor.last_name}` : 'Prof. Nahali faouzi'}
            </h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
              {professor?.title || 'technologue Génie électrique'}<br />
              ISET Gabès
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              Exploring the frontiers of artificial intelligence, machine learning, 
              and quantum computing to solve complex real-world problems.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/about" 
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md flex items-center gap-2 transition-colors hover:bg-primary/90"
              >
                <span>Learn More</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-3 border border-primary text-primary rounded-md transition-colors hover:bg-accent"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-3/4 md:w-2/3">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/40 rounded-2xl blur-md"></div>
              <img 
                // src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                src="/faouzi.jpg"
                alt={professor ? `Professor ${professor.first_name} ${professor.last_name}` : "Professor Faouzi Nahali"} 
                className="w-full rounded-xl object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

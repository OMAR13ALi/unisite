
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  cover_image_url?: string;
  delay: string;
}

interface ResearchHighlightsProps {
  researchAreas: ResearchItem[];
}

const ResearchHighlights: React.FC<ResearchHighlightsProps> = ({ researchAreas }) => {
  return (
    <section className="py-16 md:py-24 bg-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-12 text-center">
          Research Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchAreas.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border overflow-hidden animate-slide-up shadow-sm"
              style={{ animationDelay: item.delay }}
            >
              {item.cover_image_url && (
                <div className="h-40 w-full overflow-hidden">
                  <img 
                    src={item.cover_image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <Link 
                  to="/research" 
                  className="text-primary hover-underline-animation inline-flex items-center gap-1"
                >
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchHighlights;

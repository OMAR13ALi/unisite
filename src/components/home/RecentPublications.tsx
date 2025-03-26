
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  cover_image_url?: string;
  delay: string;
}

interface RecentPublicationsProps {
  publications: Publication[];
}

const RecentPublications: React.FC<RecentPublicationsProps> = ({ publications }) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center">
          Recent Publications
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          My latest contributions to academic research in artificial intelligence and computer science.
        </p>
        <div className="max-w-4xl mx-auto space-y-6">
          {publications.map((pub, index) => (
            <div 
              key={index} 
              className="overflow-hidden border rounded-md bg-white animate-slide-up shadow-sm flex flex-col md:flex-row"
              style={{ animationDelay: pub.delay }}
            >
              {pub.cover_image_url ? (
                <div className="h-40 md:w-1/3 w-full">
                  <img 
                    src={pub.cover_image_url} 
                    alt={pub.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 md:w-1/3 w-full bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center justify-center">
                  <span className="text-xl font-serif font-medium text-primary/30">Publication</span>
                </div>
              )}
              <div className="p-6 md:w-2/3 w-full">
                <h3 className="text-xl font-semibold font-serif mb-2">{pub.title}</h3>
                <p className="text-muted-foreground mb-2">{pub.authors}</p>
                <div className="text-sm text-muted-foreground">
                  <span>{pub.venue}</span>
                  <span className="mx-2">•</span>
                  <span>{pub.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link 
            to="/publications" 
            className="px-6 py-3 border border-primary text-primary rounded-md transition-colors hover:bg-accent inline-flex items-center gap-2"
          >
            <span>View All Publications</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentPublications;

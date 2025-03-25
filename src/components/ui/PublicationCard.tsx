
import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  doi?: string;
  pdf?: string;
  abstract?: string;
  cover_image_url?: string;
}

interface PublicationCardProps {
  publication: Publication;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  isExpanded = false,
  onToggleExpand
}) => {
  const { title, authors, venue, date, doi, pdf, abstract, cover_image_url } = publication;
  
  // Format authors (display all authors and highlight the professor)
  const formattedAuthors = authors.map((author, index) => {
    const isProf = author.includes("Smith"); // Highlight if the author is the professor
    
    return (
      <React.Fragment key={author}>
        <span className={isProf ? "font-semibold" : ""}>{author}</span>
        {index < authors.length - 1 && ", "}
      </React.Fragment>
    );
  });

  return (
    <div className="group mb-6 border rounded-md bg-white transition-all duration-300 hover:shadow-sm overflow-hidden">
      {cover_image_url && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={cover_image_url} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-2">
          <button 
            onClick={onToggleExpand}
            className="text-left w-full focus:outline-none"
          >
            <h3 className="text-xl font-semibold font-serif group-hover:text-primary transition-colors">
              {title}
            </h3>
          </button>
        </div>
        
        <div className="text-muted-foreground mb-3">
          {formattedAuthors}
        </div>
        
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4">
          <span className="mr-3">{venue}</span>
          <span className="mr-3">•</span>
          <span>{date}</span>
        </div>
        
        {isExpanded && abstract && (
          <div className="mt-2 mb-4 text-foreground animate-fade-in">
            <h4 className="text-sm font-semibold mb-1">Abstract</h4>
            <div 
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: abstract }}
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {pdf && (
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-muted hover:bg-secondary transition-colors"
            >
              <FileText size={14} />
              <span>PDF</span>
            </a>
          )}
          
          {doi && (
            <a
              href={`https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-muted hover:bg-secondary transition-colors"
            >
              <ExternalLink size={14} />
              <span>DOI</span>
            </a>
          )}
          
          <button
            onClick={onToggleExpand}
            className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-muted hover:bg-secondary transition-colors"
          >
            {isExpanded ? "Less" : "More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;

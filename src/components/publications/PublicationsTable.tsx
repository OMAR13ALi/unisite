
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, ExternalLink } from 'lucide-react';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  doi?: string;
  abstract: string;
  pdf_url?: string;
  created_at: string;
}

interface PublicationsTableProps {
  publications: Publication[];
  isLoading: boolean;
  onEdit: (publication: Publication) => void;
  onDelete: (id: string) => void;
}

const PublicationsTable: React.FC<PublicationsTableProps> = ({
  publications,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading publications...</p>
      </div>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No publications found. Add your first publication!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Authors</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Year</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications.map((publication) => (
          <TableRow key={publication.id}>
            <TableCell className="font-medium">{publication.title}</TableCell>
            <TableCell>{publication.authors.join(', ')}</TableCell>
            <TableCell>{publication.venue}</TableCell>
            <TableCell>{publication.date}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(publication)}
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(publication.id)}
                >
                  <Trash size={16} />
                </Button>
                {publication.doi && (
                  <a 
                    href={publication.doi.startsWith('http') ? publication.doi : `https://doi.org/${publication.doi}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PublicationsTable;

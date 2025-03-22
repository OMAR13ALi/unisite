
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Publication } from '@/services/publicationsService';

interface PublicationFormProps {
  formData: {
    title: string;
    authors: string;
    venue: string;
    date: string;
    doi: string;
    abstract: string;
    pdf_url: string;
  };
  selectedPublication: Publication | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAbstractChange: (content: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  formData,
  selectedPublication,
  handleInputChange,
  handleAbstractChange,
  handleSubmit,
  resetForm
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ScrollArea className="h-[50vh]">
          <div className="space-y-4 py-4 px-1">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                name="title"
                placeholder="Publication title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="authors" className="text-sm font-medium">Authors (comma-separated)</label>
              <Input
                id="authors"
                name="authors"
                placeholder="John Doe, Jane Smith, etc."
                value={formData.authors}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="venue" className="text-sm font-medium">Publication Venue</label>
              <Input
                id="venue"
                name="venue"
                placeholder="Journal or Conference name"
                value={formData.venue}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Year of Publication</label>
              <Input
                id="date"
                name="date"
                placeholder="2023"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="doi" className="text-sm font-medium">DOI (optional)</label>
              <Input
                id="doi"
                name="doi"
                placeholder="https://doi.org/10.xxxx/xxxxx"
                value={formData.doi || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="abstract" className="text-sm font-medium">Abstract</label>
              <RichTextEditor
                content={formData.abstract || ''}
                onChange={handleAbstractChange}
                placeholder="Publication abstract"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="pdf_url" className="text-sm font-medium">PDF URL (optional)</label>
              <Input
                id="pdf_url"
                name="pdf_url"
                placeholder="https://example.com/paper.pdf"
                value={formData.pdf_url || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      <DialogFooter className="sticky bottom-0 mt-4 pt-2 border-t bg-background">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{selectedPublication ? 'Update' : 'Save'} Publication</Button>
      </DialogFooter>
    </form>
  );
};

export default PublicationForm;

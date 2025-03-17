
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

export interface PublicationFormData {
  title: string;
  authors: string;
  venue: string;
  date: string;
  doi: string;
  abstract: string;
  pdf_url: string;
}

interface PublicationFormProps {
  formData: PublicationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          name="title"
          placeholder="Publication title"
          value={formData.title}
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="doi" className="text-sm font-medium">DOI (optional)</label>
        <Input
          id="doi"
          name="doi"
          placeholder="https://doi.org/10.xxxx/xxxxx"
          value={formData.doi}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="abstract" className="text-sm font-medium">Abstract</label>
        <Textarea
          id="abstract"
          name="abstract"
          placeholder="Publication abstract"
          value={formData.abstract}
          onChange={onInputChange}
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="pdf_url" className="text-sm font-medium">PDF URL (optional)</label>
        <Input
          id="pdf_url"
          name="pdf_url"
          placeholder="https://example.com/paper.pdf"
          value={formData.pdf_url}
          onChange={onInputChange}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{isEditing ? 'Update' : 'Save'} Publication</Button>
      </DialogFooter>
    </form>
  );
};

export default PublicationForm;

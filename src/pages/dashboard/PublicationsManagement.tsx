
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, ExternalLink } from 'lucide-react';

// Types
interface Publication {
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

// Fetch publications
const fetchPublications = async () => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as Publication[];
};

const PublicationsManagement = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    venue: '',
    date: '',
    doi: '',
    abstract: '',
    pdf_url: ''
  });

  // React Query for fetching publications
  const { data: publications, isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications
  });

  // Create publication mutation
  const createPublication = useMutation({
    mutationFn: async (newPublication: Omit<Publication, 'id' | 'created_at'> & { authors: string }) => {
      // Convert comma-separated authors to array
      const authorArray = newPublication.authors.split(',').map(author => author.trim());
      
      const { data, error } = await supabase
        .from('publications')
        .insert([{ ...newPublication, authors: authorArray }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating publication:', error);
      toast.error('Failed to create publication');
    }
  });

  // Update publication mutation
  const updatePublication = useMutation({
    mutationFn: async ({ id, ...publication }: { id: string } & Omit<Publication, 'id' | 'created_at'> & { authors: string }) => {
      // Convert comma-separated authors to array
      const authorArray = publication.authors.split(',').map(author => author.trim());
      
      const { data, error } = await supabase
        .from('publications')
        .update({ ...publication, authors: authorArray })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating publication:', error);
      toast.error('Failed to update publication');
    }
  });

  // Delete publication mutation
  const deletePublication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPublication) {
      updatePublication.mutate({ id: selectedPublication.id, ...formData });
    } else {
      createPublication.mutate(formData);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      venue: '',
      date: '',
      doi: '',
      abstract: '',
      pdf_url: ''
    });
    setSelectedPublication(null);
  };

  // Open edit dialog with publication data
  const handleEditClick = (publication: Publication) => {
    setSelectedPublication(publication);
    setFormData({
      title: publication.title,
      authors: publication.authors.join(', '),
      venue: publication.venue,
      date: publication.date,
      doi: publication.doi || '',
      abstract: publication.abstract,
      pdf_url: publication.pdf_url || ''
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deletePublication.mutate(id);
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Publications Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                  value={formData.doi}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="abstract" className="text-sm font-medium">Abstract</label>
                <Textarea
                  id="abstract"
                  name="abstract"
                  placeholder="Publication abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Publication</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Publication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-authors" className="text-sm font-medium">Authors (comma-separated)</label>
              <Input
                id="edit-authors"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-venue" className="text-sm font-medium">Publication Venue</label>
              <Input
                id="edit-venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-date" className="text-sm font-medium">Year of Publication</label>
              <Input
                id="edit-date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-doi" className="text-sm font-medium">DOI (optional)</label>
              <Input
                id="edit-doi"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-abstract" className="text-sm font-medium">Abstract</label>
              <Textarea
                id="edit-abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-pdf_url" className="text-sm font-medium">PDF URL (optional)</label>
              <Input
                id="edit-pdf_url"
                name="pdf_url"
                value={formData.pdf_url}
                onChange={handleInputChange}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Publication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Publications Table */}
      <div className="rounded-md border bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading publications...</p>
          </div>
        ) : !publications || publications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No publications found. Add your first publication!</p>
          </div>
        ) : (
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
                        onClick={() => handleEditClick(publication)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(publication.id)}
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
        )}
      </div>
    </div>
  );
};

export default PublicationsManagement;

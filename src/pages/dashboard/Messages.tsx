
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Mail, CheckCircle, XCircle } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
      
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // If message is not read, mark it as read
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-medium mb-6">Contact Messages</h2>
      
      {isLoading ? (
        <div className="text-center py-10">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No messages yet. When someone contacts you through the form, their messages will appear here.
        </div>
      ) : selectedMessage ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={closeMessage} className="mb-4">
            Back to Messages
          </Button>
          
          <div className="bg-accent p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">{selectedMessage.subject || "(No Subject)"}</h3>
              <span className="text-sm text-muted-foreground">
                {format(new Date(selectedMessage.created_at), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            
            <div className="mb-4">
              <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
            </div>
            
            <div className="border-t pt-4 whitespace-pre-wrap">
              {selectedMessage.message}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button 
                variant="outline"
                onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reply via Email
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={!message.read ? "font-medium" : ""}>
                <TableCell>
                  {message.read ? 
                    <CheckCircle className="h-4 w-4 text-primary" /> : 
                    <XCircle className="h-4 w-4 text-destructive" />
                  }
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.subject || "(No Subject)"}</TableCell>
                <TableCell>{format(new Date(message.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => viewMessage(message)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Messages;

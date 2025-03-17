
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, UserPlus, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string | null;
  role: string;
  status: string;
  created_at: string;
}

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('users_management')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users_management')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success('User role updated successfully');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users_management')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-medium">User Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUsers}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">No users found</p>
          <Button variant="outline" onClick={fetchUsers}>
            <RefreshCw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.title || 'N/A'}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserStatus(user.id, 'inactive')}
                      >
                        <X size={16} className="mr-1" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserStatus(user.id, 'active')}
                      >
                        <Check size={16} className="mr-1" />
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

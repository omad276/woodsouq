'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const { profile, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  // Initialize form values when profile loads
  if (profile && !name && !role) {
    setName(profile.name);
    setRole(profile.role);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name, role })
      .eq('id', profile?.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Profile updated successfully');
      // Reload page to refresh auth context
      setTimeout(() => window.location.reload(), 1000);
    }

    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">Profile</h1>
        <p className="text-muted-foreground">View and edit your profile information</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Update your name and role</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-wood hover:bg-wood-dark"
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Link, Image, Video, FileText, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';

interface AddMemoryModalProps {
  resortId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onSave: (data: {
    type: 'photo' | 'video';
    url: string;
    description: string;
    taggedUsers: string[];
    position: { x: number; y: number };
  }) => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ 
  resortId, 
  position, 
  onClose, 
  onSave 
}) => {
  const { users, getResortById } = useApp();
  const resort = getResortById(resortId);
  
  const [type, setType] = useState<'photo' | 'video'>('video');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = () => {
    if (!url.trim()) return;
    
    onSave({
      type,
      url: url.trim(),
      description: description.trim(),
      taggedUsers: selectedUsers,
      position,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Add Memory</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Location info */}
          <div className="p-3 bg-muted rounded-xl text-sm">
            <span className="text-muted-foreground">Adding to:</span>
            <span className="ml-2 font-medium">{resort?.name}</span>
          </div>

          {/* Type selector */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('video')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  type === 'video' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="font-medium">Video</span>
              </button>
              <button
                onClick={() => setType('photo')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  type === 'photo' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="font-medium">Photo</span>
              </button>
            </div>
          </div>

          {/* URL input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {type === 'video' ? 'YouTube URL' : 'Image URL'}
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={type === 'video' ? 'https://youtu.be/...' : 'https://...'}
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Description (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened here..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Tag users */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tag people
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserToggle(user.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedUsers.includes(user.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {selectedUsers.includes(user.id) && <Check className="w-3 h-3" />}
                  <span>{user.sport === 'ski' ? '🎿' : '🏂'}</span>
                  <span>{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={!url.trim()}>
            Add Memory
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;

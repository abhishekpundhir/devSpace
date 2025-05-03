
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Edit, Trash2 } from 'lucide-react';
import { useRepository } from '@/contexts/RepositoryContext';

interface CodeViewerProps {
  repoId: string;
  fileName: string;
  content: string;
  readOnly?: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ repoId, fileName, content: initialContent, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const { updateFile, deleteFile } = useRepository();
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    try {
      await updateFile(repoId, fileName, content);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await deleteFile(repoId, fileName);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-secondary">
        <span className="font-medium">{fileName}</span>
        {!readOnly && (
          <div className="flex space-x-2">
            {isEditing ? (
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono text-sm min-h-[30vh]"
          />
        ) : (
          <pre className="font-mono text-sm whitespace-pre-wrap bg-secondary/50 p-4 rounded-md overflow-auto max-h-[60vh]">
            {content}
          </pre>
        )}
      </div>
    </Card>
  );
};

export default CodeViewer;

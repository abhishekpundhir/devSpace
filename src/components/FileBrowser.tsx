
import React from 'react';
import { File, Folder } from 'lucide-react';

export interface FileItem {
  id?: string;
  name: string;
  type: 'file' | 'directory';
  lastCommit: string;
  lastCommitMessage: string;
  lastUpdated: string;
}

interface FileBrowserProps {
  files: FileItem[];
  onFileClick?: (fileName: string) => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ files, onFileClick }) => {
  return (
    <div className="overflow-hidden border rounded-md border-github-border">
      <table className="w-full">
        <thead>
          <tr className="bg-github-light dark:bg-github-dark/50 border-b border-github-border">
            <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold hidden md:table-cell">Last commit</th>
            <th className="px-4 py-2 text-left text-sm font-semibold hidden lg:table-cell">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr 
              key={file.id || index} 
              className="file-row hover:bg-github-light/50 dark:hover:bg-github-dark/30 cursor-pointer transition-colors"
              onClick={() => file.type === 'file' && onFileClick && onFileClick(file.name)}
            >
              <td className="px-4 py-3 text-left text-sm">
                <div className="flex items-center space-x-2">
                  {file.type === 'directory' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="font-medium">{file.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-left text-sm text-github-text hidden md:table-cell">
                {file.lastCommitMessage}
              </td>
              <td className="px-4 py-3 text-left text-sm text-github-text hidden lg:table-cell">
                {file.lastUpdated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileBrowser;

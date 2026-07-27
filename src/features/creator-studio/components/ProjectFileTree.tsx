import { useState, FC } from 'react';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { FileTreeNode, CodeFile } from '../types/creator';

interface ProjectFileTreeProps {
  treeNodes: FileTreeNode[];
  files: CodeFile[];
  onSelectFile: (file: CodeFile) => void;
  activeFilePath?: string;
}

export const ProjectFileTree: FC<ProjectFileTreeProps> = ({
  treeNodes,
  files,
  onSelectFile,
  activeFilePath,
}) => {
  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-1 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 px-2 font-bold">
        Directory Architecture
      </div>
      {treeNodes.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          files={files}
          onSelectFile={onSelectFile}
          activeFilePath={activeFilePath}
        />
      ))}
    </div>
  );
};

const TreeNodeItem: FC<{
  node: FileTreeNode;
  files: CodeFile[];
  onSelectFile: (file: CodeFile) => void;
  activeFilePath?: string;
}> = ({ node, files, onSelectFile, activeFilePath }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'folder') {
    return (
      <div className="space-y-0.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-left transition-colors cursor-pointer"
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {isOpen ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" /> : <Folder className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="font-bold">{node.name}</span>
        </button>

        {isOpen && node.children && (
          <div className="pl-4 border-l border-slate-800/80 ml-2 space-y-0.5">
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.path}
                node={child}
                files={files}
                onSelectFile={onSelectFile}
                activeFilePath={activeFilePath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = activeFilePath === node.path;
  const codeFile = files.find((f) => f.path === node.path);

  return (
    <button
      onClick={() => codeFile && onSelectFile(codeFile)}
      className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition-colors cursor-pointer ${
        isSelected
          ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30'
          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
      }`}
    >
      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

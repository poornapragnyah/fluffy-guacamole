import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

const FileTreeNode = ({ fileName, nodes, onSelect, path, expandedFolders, toggleFolder }) => {
  const isDir = !!nodes;
  const isExpanded = expandedFolders[path];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) {
          toggleFolder(path);
          return;
        }
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      <div className="flex items-center py-1 px-2 hover:bg-[#E7F0DC] cursor-pointer rounded-lg">
        {isDir ? (
          isExpanded ? (
            <ChevronDown size={16} className="mr-2 text-black" />
          ) : (
            <ChevronRight size={16} className="mr-2 text-black" />
          )
        ) : (
          <File size={16} className="mr-2 text-black" />
        )}
        <p className={isDir ? " text-black p-1 rounded-lg m-1" : "text-black p-1 rounded-lg m-1"}>
          {fileName}
        </p>
      </div>
      {isDir && isExpanded && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
                fileName={child}
                nodes={nodes[child]}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState({ '/': true }); // Root folder expanded by default

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <div className="p-2 overflow-auto h-full bg-[#B6C7AA] text-gray-200">
      <FileTreeNode
        onSelect={onSelect}
        fileName="/"
        path=""
        nodes={tree}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
      />
    </div>
  );
};

export default FileTree;

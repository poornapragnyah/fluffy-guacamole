const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      <p className={isDir ? "bg-amber-100 p-1 rounded-lg m-1" : "file-node bg-green-100 p-1 rounded-lg m-1"}>{fileName}</p>
      {nodes && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree, onSelect }) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};
export default FileTree;

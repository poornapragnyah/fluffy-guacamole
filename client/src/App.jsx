import React, { useCallback, useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { getFileMode } from "./utils/getFileMode";
import socket from "./socket";
import FileTree from "./components/FileTree";
import { ChevronRight } from "lucide-react";
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';

const Terminal = ({ height }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null)

  useEffect(() => {
    if (!xtermRef.current) {
      xtermRef.current = new XTerm({
        cursorBlink: true,
        fontSize: 16,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1e1e1e'
        }
      });
      fitAddonRef.current = new FitAddon();
      xtermRef.current.loadAddon(fitAddonRef.current);

      xtermRef.current.open(terminalRef.current);
      fitAddonRef.current.fit();
      xtermRef.current.onData((data) => {
        console.log("Data received from terminal:", data); // Debugging line
        socket.emit("terminal:write", data, (ack) => {
          console.log("Emit acknowledged:", ack); // Acknowledgment from the server
        });
      });
  
      socket.on("terminal:data", (data) => {
        console.log("Data received from server:", data);
        xtermRef.current.write(data); // Update terminal content
      });

      xtermRef.current.write('Welcome to the terminal!\r\n');
    }

    return () => {
      if (!xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);


  return (
    <div ref={terminalRef} style={{ height: `${height}px`, width: '100%' }}/>
  );
};

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const terminalRef = useRef(null);
  const [isSaved, setIsSaved] = useState(true);
  const editorRef = useRef(null);
  const [editorMounted, setEditorMounted] = useState(false);
  const [isFilePathOpen,setIsFilePathOpen] = useState(false)

  useEffect(() => {
    setIsSaved(selectedFileContent === code);
  }, [selectedFileContent, code]);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", { path: selectedFile, content: code });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    if (editorMounted && selectedFile) {
      const fileMode = getFileMode({ selectedFile });
      console.log('File mode:', fileMode);
      
      if (editorRef.current) {
        const editor = editorRef.current;
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, fileMode);
        }
      }
    }
  }, [selectedFile, editorMounted]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const maxTerminalHeight = 296;
        const newHeight = window.innerHeight - e.clientY;
        if(!isFilePathOpen){
          setTerminalHeight(Math.max(32, Math.min(newHeight, maxTerminalHeight)));
        }else{
          setTerminalHeight(Math.max(64, Math.min(newHeight, maxTerminalHeight)));
        }
        
      }
    },
    [isDragging,isFilePathOpen]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorMounted(true);
  };

  const handleEditorChange = (newValue, e) => {
    setCode(newValue);
  };

  return (
    <div className="h-screen flex flex-col bg-[#597445] text-gray-200 overflow-hidden">
      <div className="flex flex-1">
        <div className="w-1/5 bg-[#597445] overflow-hidden">
          <FileTree
            onSelect={(path) => {
              setSelectedFileContent("");
              setSelectedFile(path);
            }}
            tree={fileTree}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile && (
            <p className="flex items-center bg-[#597445] text-gray-200 p-2">
              <span className="flex-1 text-gray-400 truncate">
                {selectedFile.split('/').map((part, index, arr) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <span className="text-gray-500">
                        <ChevronRight size={16} className="mr-2 text-black inline-block" />
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </span>
              <button
                className={`ml-4 ${
                  isSaved ? 'text-green-400 bg-white rounded-lg p-1 shadow-md cursor-not-allowed' : 'text-red-400 bg-white rounded-lg p-1 shadow-md cursor-pointer'
                }`}
                onClick={() => {
                  if (!isSaved) {
                    socket.emit("file:change", { path: selectedFile, content: code });
                    setIsSaved(true);
                  }
                }}
                disabled={isSaved}
              >
                {isSaved ? "(Saved)" : "(Unsaved)"}
              </button>
            </p>
          )}
          <Editor
            width="100%"
            height={`calc(100vh - ${terminalHeight}px - 32px)`}
            language={getFileMode({ selectedFile })}
            value={code}
            theme='vs-dark'
            onChange={handleEditorChange}
            onMount={editorDidMount}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              fontSize: 18,
              minimap: { enabled: false },
            }}
          />
          <div
        ref={terminalRef}
        className="bg-[#fffff] overflow-hidden flex flex-col"
        style={{ height: terminalHeight }}
      >
        <div
          className="bg-[#597445] text-gray-300 px-4 py-1 cursor-ns-resize"
          onMouseDown={handleMouseDown}
        >
          Terminal
        </div>
        <div className="flex-1 overflow-hidden">
          <Terminal height={terminalHeight - 32} />
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

export default App;
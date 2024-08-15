// utils/getFileMode.js

export function getFileMode({ selectedFile }) {
  if (!selectedFile) return 'plaintext'; // default to plaintext if no file is selected

  const extension = selectedFile.split('.').pop();
  
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'go':
      return 'go';
    case 'swift':
      return 'swift';
    case 'sql':
      return 'sql';
    case 'md':
      return 'markdown';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'dockerfile':
      return 'dockerfile';
    default:
      return 'plaintext'; // fallback to plaintext for unknown extensions
  }
}

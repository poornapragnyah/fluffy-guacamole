import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "../socket";

import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 20,
    });

    term.open(terminalRef.current);

    term.onData((data) => {
      console.log("Data received from terminal:", data); // Debugging line
      socket.emit("terminal:write", data, (ack) => {
        console.log("Emit acknowledged:", ack); // Acknowledgment from the server
      });
    });

    socket.on("terminal:data", (data) => {
      console.log("Data received from server:", data);
      term.write(data); // Update terminal content
    });
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;

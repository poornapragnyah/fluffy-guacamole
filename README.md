# Web-Based Coding IDE - fluffy-guacamole

## Overview

This project is a web-based coding IDE built using the MERN stack (MongoDB, Express.js, React, Node.js) for the frontend and a Node-Alpine container for the backend. It provides a seamless coding environment with real-time features and secure user management.

## Features

- **Frontend:**
  - **Monaco Editor:** Integrated for a rich code editing experience.
  - **Dynamic File Tree:** Automatically updates to reflect changes in the working directory.
  - **Xterm Terminal:** Provides terminal access within the IDE.

- **Backend:**
  - **Node-Alpine Container:** Lightweight and efficient container for backend services.
  - **WebSocket Communication:** Facilitates real-time interaction between the frontend and backend.

- **User Management:**
  - **chroot Exploration:** Currently exploring the use of `chroot` to confine users to specific folders with restricted permissions to enhance security.

### Prerequisites

- Node.js and npm
- Docker (for running the Node-Alpine container)

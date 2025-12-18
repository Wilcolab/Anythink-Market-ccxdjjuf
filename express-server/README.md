# Express Server

This project is a simple Express server that listens on port 8001. It is set up to automatically restart using Nodemon whenever changes are made to the code.

## Project Structure

```
express-server
├── src
│   └── app.js          # Entry point of the application
├── package.json        # NPM configuration file
├── Dockerfile          # Instructions to build the Docker image
├── .dockerignore       # Files to ignore when building the Docker image
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Yarn package manager (optional, but recommended).

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd express-server
   ```

2. Install the dependencies:
   ```
   yarn install
   ```

### Running the Server

To start the server with automatic restarts on code changes, use:
```
yarn start
```

The server will be running on `http://localhost:8001`.

### Building the Docker Image

To build the Docker image, run:
```
docker build -t express-server .
```

### Running the Docker Container

To run the Docker container, use:
```
docker run -p 8001:8001 express-server
```

The server will be accessible at `http://localhost:8001` from your host machine.
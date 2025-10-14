import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import { router } from './http/routes';

const app = express();


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
  }
});

const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());
app.use(router);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export { io };
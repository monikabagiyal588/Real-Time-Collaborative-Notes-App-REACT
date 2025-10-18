import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import noteSocket from './socket/noteSocket.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});

app.use(cors());
app.use(express.json());
app.use('/api/notes',noteRoutes);

noteSocket(io);
sequelize.sync();

server.listen(5000,()=>
console.log('Server running on port 5000'));


import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

interface RoomParticipant {
  userId: string;
  username: string;
}

const rooms = new Map<string, RoomParticipant[]>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }
    
    rooms.get(roomId)?.push({ userId: socket.id, username });
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      username
    });
    
    // Send list of existing participants to the new user
    const participants = rooms.get(roomId) || [];
    socket.emit('room-participants', participants);
  });

  socket.on('offer', ({ to, offer }) => {
    socket.to(to).emit('offer', {
      from: socket.id,
      offer
    });
  });

  socket.on('answer', ({ to, answer }) => {
    socket.to(to).emit('answer', {
      from: socket.id,
      answer
    });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  });

  socket.on('leave-room', ({ roomId }) => {
    handleUserLeaving(socket, roomId);
  });

  socket.on('disconnect', () => {
    // Find and leave all rooms the user was in
    rooms.forEach((participants, roomId) => {
      if (participants.some(p => p.userId === socket.id)) {
        handleUserLeaving(socket, roomId);
      }
    });
  });
});

function handleUserLeaving(socket: any, roomId: string) {
  const room = rooms.get(roomId);
  if (room) {
    const index = room.findIndex(p => p.userId === socket.id);
    if (index !== -1) {
      room.splice(index, 1);
      if (room.length === 0) {
        rooms.delete(roomId);
      }
    }
    socket.to(roomId).emit('user-left', {
      userId: socket.id
    });
  }
  socket.leave(roomId);
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
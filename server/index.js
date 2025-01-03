const http = require('http');
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); // As both runs on different origins
const {Server} = require('socket.io');

const app = express();
app.use(cors());

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/myMeet', {
    // useNewUrlParser: true
    // useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error : ${err}`));
// Creating Schema
const roomSchema = mongoose.Schema({
    name: { type: String , unique: true , required : true }
})
const Room = mongoose.model('Room', roomSchema)


// Setup the server
const server = http.createServer(app);
const io = new Server(server, { // Registered in socket
    cors: {
        origin: "http://localhost:3000", // Frontend origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
})
const PORT = 5001;
server.listen(PORT, () => console.log(`Server listending at http://localhost:${PORT}`));

// Socket.IO events
const usersMap = {} // { socketId: { roomId, username } }
const rooms = {} // { roomId: [socketId1, socketId2, ...] }
// Even if two users have the same username, their socket.id ensures uniqueness. O(1) to search and do the operation
io.on('connection', (socket) => {
    console.log('A User Connected : ' + socket.id);

    // Handle join room event
    socket.on('joinRoom', ({roomId, username}) => {
        // Save user globally with socket.id as key
        usersMap[socket.id] = { roomId, username };
        if (!rooms[roomId]) rooms[roomId] = []; // if that room is not there in the room array add it
        rooms[roomId].push(socket.id ); // add the socket id in that room

        // Log the IP address
        console.log(`User ${username} joined room ${roomId} from IP: ${socket.handshake.address}`);
        
        // Notify others in the room
        socket.join(roomId);
        socket.to(roomId).emit('userJoined', username);

        // Send the updated list of users in the room with id and username
        const userList = rooms[roomId].map((socketId, index) => ({
            id: index, // Index in the array
            username: usersMap[socketId].username, // Username from usersMap
        }));
        io.to(roomId).emit('roomUsers', userList);
    })
    // Handle disconnect room event
    socket.on('disconnect', () => {
        if(!usersMap[socket.id]) { // Check if the user exists in the map
            console.log('A user disconnected: unknown');
            return;
        }
        const { roomId, username } = usersMap[socket.id];
        console.log('A user disconnected:', username);

        // Remove the user from rooms
        if(rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
            if (rooms[roomId].length === 0) delete rooms[roomId]; // Delete room if empty
        }

        // remove the socket id and user details globally
        delete usersMap[socket.id];

        // Notify room about disconnection
        io.to(roomId).emit('roomUsers', rooms[roomId]?.map((id) => usersMap[id]?.username)); // if the roomId exists then go to map with all the socket ids defined inside then go to global one to get the name
        // ?. is optional chaining operator, used to safely access deeply nested properties in objects without having to explicitly check for the existence of each level in the chain. If any part of the chain is null or undefined, the expression will short-circuit and return undefined instead of throwing an error.
    })
});


// Endpoints
app.get('/', async (req, res) => { // To find all rooms
    try {
        const rooms = await Room.find()
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({error:`${error}`})
    }
});

app.post('/rooms', async (req, res) => { // To create a new room
    const roomName = req.query.name;
    console.log(roomName);
    // if the req is empty
    if(!roomName) res.status(400).json({ error: 'Room name is required' });
    try {
        // if room already exists
        const existingRoom = await Room.findOne({ name: roomName });
        if (existingRoom) {
            return res.status(409).json({ error: 'Room name already exists' }); // 409 Conflict
        }

        // if room doesn't exist then create new
        const room = new Room({ name: roomName });
        await room.save();
        res.status(201).json(room); // Dont return the whole data just return return the statustext or roomname
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room' });
    }
});


// If someone closes the tab or some cases arises when we dont know the socket id so we can't delete the specific user details
// So we will use timer cleanup
const cleanupStaleUsers = () => {
    for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((id) => !!usersMap[id]); // Keep only valid socket IDs, !! is for boolean conversion
        if (rooms[roomId].length === 0) delete rooms[roomId]; // Remove empty rooms
    }
    console.log('Cleaned up stale users');
}
setInterval(cleanupStaleUsers, 3600000); // Run cleanup every 1 hour
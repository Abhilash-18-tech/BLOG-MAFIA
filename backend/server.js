const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Seed categories automatically if empty
const Category = require('./models/Category');
const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('Seeding initial categories...');
      const initialCategories = [
        { name: 'Technology' },
        { name: 'Lifestyle' },
        { name: 'Programming' },
        { name: 'Health & Fitness' },
        { name: 'Finance' },
        { name: 'Travel' }
      ];
      await Category.insertMany(initialCategories);
      console.log('Categories seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};
seedCategories();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// We need the Message model to save it directly via websockets for fastest reaction time
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // User connects, joins a personal room (named exactly their MongoDB User ID)
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`User mapped to personal room: ${userData._id}`);
  });

  // Regular comment logic
  socket.on('join_post', (postId) => {
    socket.join(postId);
    console.log(`User ${socket.id} joined room: ${postId}`);
  });

  // Direct Messaging Logic (Instagram style chat)
  socket.on('send_message', async (messageData) => {
    try {
      const { senderId, receiverId, text } = messageData;
      
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text
      });

      console.log(`Message sent from ${senderId} to ${receiverId}`);
      
      // Emit the message to the receiver's personal room instantly
      io.to(receiverId).emit('receive_message', newMessage);
      // Even sender's other tabs could listen to it if we want
      io.to(senderId).emit('receive_message', newMessage);

    } catch (error) {
      console.log('Message Save Error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors());

const session = require('express-session');
const passport = require('./config/passport');

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret_session',
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai.routes'));

// Error Handler Middleware
app.use(require('./middlewares/errorHandler'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

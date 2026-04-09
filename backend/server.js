const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
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

// Error Handler Middleware
app.use(require('./middlewares/errorHandler'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

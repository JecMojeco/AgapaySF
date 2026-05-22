require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const residentRoutes = require('./routes/residentRoutes');
const structureRoutes = require('./routes/structureRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const evacuationRoutes = require('./routes/evacuationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pregame-custodian-munchkin.ngrok-free.dev',
    /\.ngrok-free\.app$/
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/structures', structureRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/evacuations', evacuationRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AgapaySF API is running' });
});

// Serve frontend build in production or for testing
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Handle SPA routing - redirect all other requests to index.html
app.get('/:path*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

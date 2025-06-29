const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 registration attempts per hour
  message: {
    error: 'Too many registration attempts, please try again later.'
  }
});

app.use(limiter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackfest2025';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Team Schema
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    unique: true
  },
  teamLeader: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  college: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  members: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  experience: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  track: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'ai', 'blockchain']
  },
  idea: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'waitlist', 'rejected'],
    default: 'pending'
  },
  confirmationToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
teamSchema.index({ email: 1 });
teamSchema.index({ teamName: 1 });
teamSchema.index({ registrationDate: -1 });

const Team = mongoose.model('Team', teamSchema);

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Utility function to generate confirmation token
const generateConfirmationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Utility function to send confirmation email
const sendConfirmationEmail = async (teamData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email service not configured. Skipping email send.');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: teamData.email,
    subject: '🎉 HackFest 2025 Registration Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea; margin: 0; font-size: 28px;">🚀 HackFest 2025</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Registration Confirmed!</p>
          </div>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Team Details:</h2>
            <p><strong>Team Name:</strong> ${teamData.teamName}</p>
            <p><strong>Team Leader:</strong> ${teamData.teamLeader}</p>
            <p><strong>College:</strong> ${teamData.college}</p>
            <p><strong>Track:</strong> ${teamData.track.charAt(0).toUpperCase() + teamData.track.slice(1)}</p>
            <p><strong>Experience Level:</strong> ${teamData.experience.charAt(0).toUpperCase() + teamData.experience.slice(1)}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d5a2d; margin-top: 0;">📅 Event Details:</h3>
            <p><strong>Date:</strong> March 15-16, 2025</p>
            <p><strong>Venue:</strong> IIT Delhi</p>
            <p><strong>Registration:</strong> 9:00 AM (Day 1)</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">⚡ What's Next?</h3>
            <ul style="color: #856404; padding-left: 20px;">
              <li>Check your email regularly for updates</li>
              <li>Join our Discord server (link will be shared soon)</li>
              <li>Start brainstorming your project idea</li>
              <li>Bring your laptops and chargers on event day</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              If you have any questions, reach out to us at 
              <a href="mailto:contact@hackfest2025.com" style="color: #667eea;">contact@hackfest2025.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This is an automated email. Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamData.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Validation middleware
const validateRegistration = (req, res, next) => {
  const { teamName, teamLeader, email, phone, college, experience, track } = req.body;

  // Required field validation
  if (!teamName || !teamLeader || !email || !phone || !college || !experience || !track) {
    return res.status(400).json({
      error: 'All required fields must be provided',
      required: ['teamName', 'teamLeader', 'email', 'phone', 'college', 'experience', 'track']
    });
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Please provide a valid email address'
    });
  }

  // Phone validation
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
    return res.status(400).json({
      error: 'Please provide a valid phone number'
    });
  }

  // Team name length validation
  if (teamName.length < 2 || teamName.length > 50) {
    return res.status(400).json({
      error: 'Team name must be between 2 and 50 characters'
    });
  }

  // Experience validation
  if (!['beginner', 'intermediate', 'advanced'].includes(experience)) {
    return res.status(400).json({
      error: 'Experience level must be beginner, intermediate, or advanced'
    });
  }

  // Track validation
  if (!['web', 'mobile', 'ai', 'blockchain'].includes(track)) {
    return res.status(400).json({
      error: 'Track must be web, mobile, ai, or blockchain'
    });
  }

  // Members validation (optional but if provided, validate)
  if (req.body.members && Array.isArray(req.body.members)) {
    const validMembers = req.body.members.filter(member => member && member.trim() !== '');
    if (validMembers.length > 3) {
      return res.status(400).json({
        error: 'Maximum 3 additional members allowed (4 total including leader)'
      });
    }
  }

  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all registered teams (with pagination and filtering)
app.get('/api/teams', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const track = req.query.track;
    const experience = req.query.experience;
    
    const query = {};
    if (track) query.track = track;
    if (experience) query.experience = experience;

    const teams = await Team.find(query, '-confirmationToken -__v')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Team.countDocuments(query);
    
    res.status(200).json({
      teams,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTeams: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      error: 'Failed to fetch teams'
    });
  }
});

// Get registration statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const trackStats = await Team.aggregate([
      { $group: { _id: '$track', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const experienceStats = await Team.aggregate([
      { $group: { _id: '$experience', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const recentRegistrations = await Team.countDocuments({
      registrationDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      totalTeams,
      trackStats,
      experienceStats,
      recentRegistrations
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

// Register a new team
app.post('/api/register', registrationLimiter, validateRegistration, async (req, res) => {
  try {
    const {
      teamName,
      teamLeader,
      email,
      phone,
      college,
      members,
      experience,
      track,
      idea
    } = req.body;

    // Check if team name or email already exists
    const existingTeam = await Team.findOne({
      $or: [
        { teamName: teamName.trim() },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (existingTeam) {
      const duplicateField = existingTeam.teamName === teamName.trim() ? 'team name' : 'email';
      return res.status(409).json({
        error: `A team with this ${duplicateField} already exists`,
        field: duplicateField
      });
    }

    // Check registration limit (optional - you can set a max number of teams)
    const totalTeams = await Team.countDocuments();
    const MAX_TEAMS = process.env.MAX_TEAMS ? parseInt(process.env.MAX_TEAMS) : 1000;
    
    if (totalTeams >= MAX_TEAMS) {
      return res.status(400).json({
        error: 'Registration is full. Please join the waitlist.',
        waitlist: true
      });
    }

    // Filter and clean members array
    const cleanMembers = members ? members.filter(member => member && member.trim() !== '') : [];

    // Generate confirmation token
    const confirmationToken = generateConfirmationToken();

    // Create new team
    const newTeam = new Team({
      teamName: teamName.trim(),
      teamLeader: teamLeader.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      college: college.trim(),
      members: cleanMembers,
      experience,
      track,
      idea: idea ? idea.trim() : '',
      confirmationToken,
      status: 'confirmed' // Auto-confirm for now
    });

    await newTeam.save();

    // Send confirmation email
    await sendConfirmationEmail(newTeam);

    // Return success response (don't include sensitive data)
    const responseData = {
      id: newTeam._id,
      teamName: newTeam.teamName,
      teamLeader: newTeam.teamLeader,
      email: newTeam.email,
      college: newTeam.college,
      track: newTeam.track,
      experience: newTeam.experience,
      registrationDate: newTeam.registrationDate,
      status: newTeam.status
    };

    res.status(201).json({
      message: 'Team registered successfully!',
      team: responseData
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const duplicateField = error.keyPattern.teamName ? 'team name' : 'email';
      return res.status(409).json({
        error: `A team with this ${duplicateField} already exists`,
        field: duplicateField
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    res.status(500).json({
      error: 'Registration failed. Please try again later.'
    });
  }
});

// Get team by ID
app.get('/api/team/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id, '-confirmationToken -__v');
    
    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid team ID format'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch team'
    });
  }
});

// Update team status (admin endpoint)
app.patch('/api/team/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'waitlist', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: pending, confirmed, waitlist, or rejected'
      });
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, select: '-confirmationToken -__v' }
    );

    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    res.status(200).json({
      message: 'Team status updated successfully',
      team
    });
  } catch (error) {
    console.error('Error updating team status:', error);
    res.status(500).json({
      error: 'Failed to update team status'
    });
  }
});

// Delete team (admin endpoint)
app.delete('/api/team/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    res.status(200).json({
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      error: 'Failed to delete team'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${MONGODB_URI}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
});
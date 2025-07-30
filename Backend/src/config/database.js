const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://mukeshghildiyal435:rvIOdY3LnVNu099V@cluster0.cd8igda.mongodb.net/NOTE';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 
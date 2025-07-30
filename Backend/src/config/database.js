const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const mongoUri = process.env.MONGODB_URI

=======
    const mongoUri = process.env.MONGODB_URI ;
    
>>>>>>> e795cc0e79f002d6b7c886ed0e214bf9c145524b
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

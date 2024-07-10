const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
// const mongoURI = 'mongodb+srv://lohitkallugol:admin@cluster12.ghgtsb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster12';
const mongoURI = process.env.MONGO_URI;
// const mongoURI ="mongodb://localhost:27017/Taskdb";
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.get("/",(req,res)=>{
    res.send("Hello world");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

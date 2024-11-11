require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

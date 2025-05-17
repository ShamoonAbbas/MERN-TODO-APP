// ====================
// Import Dependencies
// ====================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

// ====================
// App Configuration
// ====================
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ====================
// Database Connection
// ====================
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/Todo';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ====================
// Routes Configuration
// ====================
app.post('/api/todos', async (req, res) => {
  try {
    const { task } = req.body;
    const newTodo = await TodoModel.create({ task, done: false });
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
});

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.put('/api/todos/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { done: true }, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editing task" });
  }
});

app.put('/api/todos/update/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { task }, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
});

app.delete('/api/todos/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    res.json(deletedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

// ====================
// Start Server
// ====================
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port: ${PORT}`);
});

module.exports = app;

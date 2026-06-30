// Define the data structure
const mongoose = require('mongoose')

// Schema
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

module.exports = mongoose.model('Blog', blogSchema)
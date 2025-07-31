// File: models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
});

module.exports = mongoose.model('Product', ProductSchema);

// File: models/Department.js
const DepartmentSchema = new mongoose.Schema({
  name: String,
});
module.exports = mongoose.model('Department', DepartmentSchema);

// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Department = require('./models/Department');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ecommerce');

// REST API for Products
app.get('/api/products', async (req, res) => {
  const query = req.query.department
    ? { department: req.query.department }
    : {};
  const products = await Product.find(query).populate('department');
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('department');
  res.json(product);
});

// REST API for Departments
app.get('/api/departments', async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// File: loadCSV.js
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('./models/Product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce');

fs.createReadStream('products.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const product = new Product(row);
    await product.save();
  });

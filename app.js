
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const async = require('async');
const notifier = require('node-notifier');


const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'users';




mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});



;

const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname,"public")))
   res.sendFile(path.join(__dirname, 'public', 'login.html'));
  
});

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.send('Invalid username or password');
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.send('Invalid username or password');
    return;
  }
  app.use(express.static(path.join(__dirname,"public")))
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Product = mongoose.model('Product', productSchema);

app.post('/addProduct', async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;

  const newProduct = new Product({ name: name, price: price });
  await newProduct.save();

  res.send('Product added successfully');
});

app.post('/calculateTotalPrice', async (req, res) => {
  const products = req.body.products;
  let totalPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await Product.findOne({ name: products[i].name });
    totalPrice += product.price * products[i].quantity;
  }

  res.send('Total Price: ' + totalPrice);
});







app.get('/login', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  
  try {
    const product = await Product.findOne({ name: searchTerm }).exec();
    if (product) {
      const message = `Product ${product.name} is available at a price of ${product.price}`;
      res.send(`<script>alert('${message}');window.history.back();</script>`);
    } else {
      res.send(`<script>alert('Product not available');window.history.back();</script>`);
    }
  } catch (error) {
    res.send(`<script>alert('Error: ${error.message}');window.history.back();</script>`);
  }

});

















  app.listen("3000",()=>{
    console.log("listening to port 3000");
  });

/*const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/products', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// Create a product model
const Product = mongoose.model('Product', productSchema);

// Create an express app


// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML page with the product dropdown
app.get('/', async (req, res) => {
  try {
    // Get all products from the database
    const products = await Product.find({}, 'name price');

    // Render the HTML page with the product dropdown
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Add to Cart</title>
        <style>
          form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
            font-family: Arial, sans-serif;
            font-size: 16px;
          }
          label {
            margin-top: 10px;
            margin-bottom: 5px;
            text-align: center;
            font-weight: bold;
          }
          input[type="submit"] {
            margin-top: 20px;
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
          }
          input[type="submit"]:hover {
            background-color: #2980b9;
          }
          #bill {
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <form action="/" method="POST">
          <label for="product">Product:</label>
          <select id="product" name="product">
            <option value="">Select a product...</option>
            ${products.map(product => `
              <option value="${product.name}|${product.price.toFixed(2)}">$${product.price.toFixed(2)} - ${product.name}</option>
            `).join('')}
          </select>
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" min="1" max="10" value="1">
          <input type="submit" value="Add to Cart">
        </form>
        <div id="bill">
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.log(err);
    res.send('Error retrieving products from database');
  }
});

// Handle the form submission
app.post('/', async (req, res) => {
  try {
    // Parse the selected product and quantity from the request body
    // Find the selected product in the database
const product = await Product.findOne({ name: productName });

// If the product doesn't exist, throw an error
if (!product) {
  throw new Error(`Product "${productName}" not found`);
}

// Calculate the total price
const totalPrice = product.price * quantity;

// Render the HTML page with the bill
res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Add to Cart</title>
    <style>
      #bill {
        margin-top: 50px;
        text-align: center;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
      }
      #bill span {
        color: #3498db;
      }
    </style>
  </head>
  <body>
    <div id="bill">
      <span>Product:</span> ${productName}<br>
      <span>Price:</span> $${productPrice}<br>
      <span>Quantity:</span> ${quantity}<br>
      <span>Total Price:</span> $${totalPrice.toFixed(2)}
    </div>
  </body>
  </html>
`);

} catch (err) {
  console.log(err);
  res.send('Error adding product to cart: ${err.message}');
  }
  });
*/






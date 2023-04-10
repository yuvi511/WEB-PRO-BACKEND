
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

  const user = await User.findOne({ username: username, password: password });

  if (!user) {
    res.send('Invalid username or password');
    return;
  }
  
  app.use(express.static(path.join(__dirname,"public")))
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


/*app.post('/login', async (req, res) => {
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
})*/


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



app.use(express.json());




app.get('/cart', async (req, res) => {
  const products = await Product.find();
  const options = products.map(product => `<option value="${product.name}">${product.name}</option>`).join('');
  const form = `
    <style>
      body {
        background-color: #f8f9fa;
      }
      .form-container {
        max-width: 500px;
        margin: auto;
        padding: 30px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      label {
        margin-bottom: 5px;
        font-weight: bold;
      }
      .form-control {
        margin-bottom: 20px;
      }
      .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
      }
      .btn-primary:hover {
        background-color: #0069d9;
        border-color: #0062cc;
      }
    </style>
    <div class="container mt-5">
      <div class="form-container">
        <form action="/calculateTotalPrice" method="post">
          <div class="form-group">
            <label for="product">Product:</label>
            <select class="form-control" id="product" name="product">
              ${options}
            </select>
          </div>
          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input class="form-control" type="number" id="quantity" name="quantity" min="1" value="1">
          </div>
          <button type="submit" class="btn btn-primary">Calculate Total Price</button>
        </form>
      </div>
    </div>
  `;
  res.send(form);
  })

  
  


  


  app.post('/calculateTotalPrice', async (req, res) => {
    const productName = req.body.product;
    const quantity = req.body.quantity;
    const product = await Product.findOne({ name: productName });
    if (product) {
      const totalPrice = product.price * quantity;
      const response = `
        <html>
          <head>
            <title>Calculate Total Price</title>
            <style>
              body {
                background-color: #f8f9fa;
              }
              .container {
                max-width: 500px;
                margin: auto;
                padding: 30px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                background-color:#FFB4B4;
                color:#002B5B;
              }
              h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              p {
                font-size: 18px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Calculate Total Price</h1>
              <p>Total Price: ${totalPrice} Rs</p>
            </div>
          </body>/
        </html>
      `;
      res.send(response);
    } else {
      res.status(400).send(`Product not found: ${productName}`);
    }
  });


  // Define the schema for the user model
const userSchema2 = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});


const UserN = mongoose.model('User2', userSchema2);



app.get('/cart-success', (req, res) => {
  
  const name = req.query.fname;
  const email = req.query.email;
  const phone = req.query.phone;

  
  const newUser = new UserN({
    name,
    email,
    phone
  });

  
  newUser.save()
    .then(() => {
      res.send('<div style="background-color: #C0DBEA; color: #721c24; padding: 10px; border-radius: 5px; margin-top: 10px;"><p style="font-size: 18px; font-weight: bold;">Thank you for contacting us!</p><p>We will get back to you shortly.</p></div>');
    })
    .catch(err => console.log(err));
});


  
  





app.listen("3000",()=>{
    console.log("listening to port 3000");
  });


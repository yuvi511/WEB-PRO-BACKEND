
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'users';




mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});





const User = mongoose.model('User', userSchema);


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public2")))
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username, password: password });

    if (!user) {
        res.render('login', { error: 'Invalid username or password' });
        return;
    }
    app.use(express.static(path.join(__dirname,"public")))
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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






app.post('/addProduct', async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;

  const newProduct = new Product({ name: name, price: price });
  await newProduct.save();

  res.send('Product added successfully');
});


const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});


const Product = mongoose.model('Product', productSchema);


app.set('view engine', 'ejs');

app.get('/cart', async (req, res) => {
  const products = await Product.find();
  const options = products.map(product => `<option value="${product.name}">${product.name}</option>`).join('');
  res.render('cart', { products, options });
});

// Handle the form submission to calculate the total price
app.post('/calculateTotalPrice', async (req, res) => {
  const { product, quantity } = req.body;
  const selectedProduct = await Product.findOne({ name: product });
  const totalPrice = selectedProduct.price * quantity;
  res.render('totalPrice', { product, quantity, totalPrice });
});


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



const UserN = mongoose.model('UserN', userSchema2);

const ejs = require('ejs');

app.set('view engine', 'ejs');



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
      const data = {
        title: 'Form Submitted Successfully',
        message: 'Thank you for contacting us! We will get back to you shortly'+' '+name
      };
      res.render('success', { data });
    })
    .catch(err => console.log(err));
});



  
app.listen("3000",()=>{
    console.log("listening to port 3000");
  });
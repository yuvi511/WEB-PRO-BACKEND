
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'users';

/*app.use(express.static(path.join(__dirname,"public")));*/

mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
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

  if (!passwordMatch) {
    res.send('Invalid username or password');
    return;
  }
  app.use(express.static(path.join(__dirname,"public")))
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




/*const express = require('express');

const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname,"public")));


app.get('/',(req,res)=>{
    res.end();
})


app.listen("3000",()=>{
    console.log("Listening At Port 3000");
})*/
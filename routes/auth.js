// loads required module
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// User signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      password: hashedPassword
    });
    res.redirect('/auth/login');
  } catch (error) {
    res.render('signup', { error: 'Username already exists' });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    req.session.userName = username;
    req.session.save(() => {
      req.session.userId = user.id;
      req.session.userName = username;
    });

    res.redirect('/dashboard');
    
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('<center><br><br><font size="5">You are logged out ! <br><br> <a href="/">Go Home</a></font></center>');
 
});
// exports router
module.exports = router;

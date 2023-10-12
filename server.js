// loads required modules
const path = require('path');
require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');


const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

let sequelize = require('./config/database');
sequelize = new Sequelize(process.env.JAWSDB_URL, {
  dialect: 'mysql',
  logging: true 
});


const handlebars = require('express-handlebars');
const hbs = handlebars.create({
  partialsDir: [
    'views/partials/' 
  ],

  helpers: {
    truncatedContent: function (content) {
      if (content.length > 200) {
        return content.substring(0, 200) + '...';
      }
      return content;
    },
    gt: function (a, b) {
      return a > b;
    }
  }
});

//REGISTERING HEADER AND FOOTER TEMPLATES
hbs.handlebars.registerPartial('footer', '{{> footer}}');
hbs.handlebars.registerPartial('header', '{{> header}}');

hbs.handlebars.registerHelper('gt', function(a, b, options) {
  return a > b ? options.fn(this) : options.inverse(this);
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/dashboard', require('./routes/dashboard'));

// Start the server
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});

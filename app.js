var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
var bookRoute = require('./routes/book');
var reservedBookRoute = require('./routes/reservedBook')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var userRoute = require('./routes/user')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/library',{ useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.set('useCreateIndex', true);

// to make sure db connected successfully or not
mongoose.connection.once('open', () => {
  // we're connected!
  console.log("Database conected successfully to the server");
}).on('error', (error) => {
  console.log('connection error: ', error);
});

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bookRoute)
app.use(reservedBookRoute)
app.use(userRoute)
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

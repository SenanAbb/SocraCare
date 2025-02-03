var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var hospitalRouter = require('./routes/hospital');
var doctorRouter = require('./routes/doctor');

var app = express();

//express-session
app.use(
  session({
    secret: 'socracare', // Cambia esto por una clave segura
    resave: false, // NO guardar sesión si no ha cambiado
    saveUninitialized: false, // NO guardar sesiones vacías
    cookie: {
      httpOnly: true, // Evita acceso desde JS en el cliente
      secure: false, // Debe ser true si se usa HTTPS en producción
      sameSite: 'lax', // Configuración recomendada para evitar problemas de cookies
      maxAge: 1000 * 60 * 60, // Expiración en 1 hora
    },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hospital', hospitalRouter);
app.use('/doctor', doctorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

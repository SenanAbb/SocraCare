var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

// Home page
router.get('/', indexController.openIndex);

// Renderiza el login
router.get('/login', indexController.openLogin);

// Recoge los datos del login y realiza el login
router.post('/login', indexController.login);

// Logout
router.get('/logout', indexController.logout);

module.exports = router;

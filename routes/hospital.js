const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');

const hospitalController = require('../controllers/hospitalController');

// Renderiza el formulario de registro de un hospital
router.get('/new', hospitalController.newForm);

// Recoge el POST y crea el hospital
router.post('/create', upload('hospital'), hospitalController.create);

// Renderiza la página de un hospital concreto
router.get('/show/:id', hospitalController.showOne);

// Renderiza la página de edición de un hospital concreto
router.get('/edit/:id', hospitalController.editForm);

// Recoge el POST y edita el hospital
router.post('/edit/:id', upload('hospital'), hospitalController.edit);

// Eliminado lógico de un hospital
router.get('/delete/:id', hospitalController.delete);

// Buscar un hospital (inicialmente por nombre)
router.get('/search', hospitalController.search);

module.exports = router;

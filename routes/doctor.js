const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadImage');

const doctorController = require('../controllers/doctorController');

// Renderiza el formulario de registro de un hospital
router.get('/new/:hospital_id', doctorController.newForm);

// Recoge el POST y crea el hospital
router.post('/create/:hospital_id', upload('doctor'), doctorController.create);

// Renderiza la página de edición de un doctor concreto
router.get('/edit/:id', doctorController.editForm);

// Recoge el POST y edita el doctor
router.post('/edit/:id', doctorController.edit);

// Eliminado lógico de un doctor
router.get('/delete/:id', doctorController.delete);

// Buscar un doctor
router.get('/search', doctorController.search);

module.exports = router;

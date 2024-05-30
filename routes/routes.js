const express = require('express');
const router = express.Router();
const { validarCliente} = require('../controllers/validarEntidadControllers');

router.get('/validar-cliente', validarCliente
);

module.exports = router;

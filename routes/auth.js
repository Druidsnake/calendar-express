const {response} = require('express');
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

const { createUser, login, renewToken } = require('../controllers/auth.js');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    createUser
)

router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    login
)

router.post('/renew', validarJWT, renewToken)

module.exports = router;
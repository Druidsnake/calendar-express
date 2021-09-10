const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

//const { createUser, login, renewToken } = require('../controllers/auth.js');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

router.get('/', getEvents)

router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    createEvent
)

router.put('/:id', updateEvent)

router.delete('/:id', deleteEvent)

module.exports = router;
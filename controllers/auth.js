const { request, response } = require('express');
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await User.findOne({ email });

        if(usuario){
            return res.status(400).json({
                "ok": false,
                "msg": "el usuario ya existe"
            });
        }

        usuario = new User( req.body );

        const salt = await bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            "ok": true,
            "uid": usuario.id,
            "name": usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(422).json({
            "ok": false,
            "msg": "ocurrio un problema durante la operacion"
        });
    }

}

const renewToken = async(req = request, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid,
        name
    });

}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errors.mapped()
            });
        }

        let usuario = await User.findOne({ email });

        if (!usuario){
            return res.status(422).json({
                ok: false,
                msg: "credenciales incorrectas"
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(422).json({
                ok: false,
                msg: "credenciales incorrectas"
            });
        }

        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            "ok": true,
            "msg": "login",
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(422).json({
            "ok": false,
            "msg": "ocurrio un problema durante la operacion"
        });
    }
}

module.exports ={
    createUser,
    renewToken,
    login
}
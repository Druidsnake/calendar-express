const { request, response } = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');


const getEvents = async (req = request, res = response) => {

    const events = await Event.find()
                                .populate('user', 'name');

    return res.json({
        ok: true,
        events: events
    });
}

const createEvent = async (req = request, res = response) => {

    const evento = new Event(req.body);

    try {
        evento.user = req.uid;

        await evento.save();

        res.json({
            ok: true,
            eventId: evento.id,
            msg: "creado exitosamente"
        });
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: "ocurrio un problema durante la grabacion"
        });
    }
}

const updateEvent = async (req = request, res = response) => {

    const eventoID = req.params.id;

    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoID);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: "evento no encontrado"
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: "no tiene privilegios para editar este evento"
            });
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }

        const eventoActualizado = await Event.findByIdAndUpdate(eventoID, nuevoEvento, {new: true});

        res.json({
            ok: true,
            event: eventoActualizado,
            msg: "evento actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            id: req.id,
            msg: "ocurrio un problema durante la actualizacion"
        });
    }
}


const deleteEvent = async (req = request, res = response) => {

    const eventoID = req.params.id;

    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoID);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "evento no encontrado"
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: "no tiene privilegios para eliminar este evento"
            });
        }

        const deletedEvent = await Event.findByIdAndRemove(eventoID)

        if(!deletedEvent){
            return res.status(422).json({
                ok: false,
                msg: "no se pudo eliminar el evento"
            });
        }

        res.json({
            ok: true,
            msg: "evento eliminado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            id: req.id,
            msg: "ocurrio un problema durante la eliminacion"
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
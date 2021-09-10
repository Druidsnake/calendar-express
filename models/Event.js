const { Schema, model } = require("mongoose");
const Event = require("./Event");

const EventSchema = Schema({
    title: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true,
        unique: true
    },
    end: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

EventSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Event', EventSchema);

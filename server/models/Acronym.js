const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const AcronymSchema = new mongoose.Schema({
    acronym: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    definition: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: String,
        //default: [],
    },
    blacklist: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    creator: {
        type: String,
        required: true,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

AcronymSchema.statics.toAPI = (doc) => ({
    acronym: doc.acronym,
    definition: doc.definition,
    tags: doc.tags,
    blacklist: doc.blacklist,
    creator: doc.creator,
});

const AcronymModel = mongoose.model('Acronym', AcronymSchema);
module.exports = AcronymModel;
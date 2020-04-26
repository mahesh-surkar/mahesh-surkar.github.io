/**
 * Shop.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        schema: true,

        userId: {
            type: objectid, //From user collection
            required: true,
        },

        isActive: {
            type: boolean,
            required: true,
            defaultsTo: true,
        },

        shopName: {
            type: 'string',
            required: true,
            minLength: 5,
        },

        contactPerson: {
            type: 'string',
            required: true,
            minLength: 2,
        },

        mobileNumber: {
            type: 'string',
            required: true
        },

        PhoneNumber: {
            type: 'string',
            required: true
        },

        addressLine1: {
            type: 'string',
            required: true
        },

        addressLine2: {
            type: 'string',
            required: true
        },

        addressLine3: {
            type: 'string',
            required: true
        },

        city: {
            type: 'string',
            required: true
        },

        district: {
            type: 'string',
            required: true
        },

        state: {
            type: 'string',
            required: true
        },

        country: {
            type: 'string',
            required: true
        },

        pincode: {
            type: 'integer',
            required: true
        },

        toJSON: function() {
            var obj = this.toObject();
            /*delete obj.password;*/
            return obj;
        },
    },
    beforeValidate: function(values, cb) {
        User.findOne({ email: values.email }).exec(function(err, record) {
            //console.log("record" + record)
            uniqueEmail = !err && !record;
            cb();
        });
    },
};
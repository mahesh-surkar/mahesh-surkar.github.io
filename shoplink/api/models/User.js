/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
    uniqueEmail: false,

    types: {
        uniqueEmail: function(value) {
            //console.log("uniqueEmail : " + uniqueEmail);
            return uniqueEmail;
        }
    },

    attributes: {
        schema: true,

        email: {
            type: 'email',
            required: true,
            unique: true,
            uniqueEmail: true
        },

        password: {
            type: 'string',
            minLength: 6,
            required: true
        },

        firstName: {
            type: 'string',
            minLength: 2,
            required: true
        },

        lastName: {
            type: 'string',
            minLength: 2,
            required: true
        },

        mobileNumber: {
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

        roleGroup: {
            type: 'string',
            enum: ['user', 'manager', 'admin'],
            defaultsTo: "user"
        },

        secretQuestion: {
            type: 'string',
            required: true
        },

        secretAnswer: {
            type: 'string',
            required: true
        },

        recoveryCode: {
            type: 'string',
        },

        recoveryCodeTime: {
            type: 'string',
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj.accessToken;
            delete obj.roleGroup;
            delete obj.secretAnswer;
            delete obj.recoveryCode;
            delete obj.recoveryCodeTime;

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

    beforeCreate: function(user, cb) {
        //console.log("salting password");
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }

};
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },
    profile: {
        type: String,
        required: [true, 'Profile selection is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

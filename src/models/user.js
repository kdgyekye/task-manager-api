const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task')


const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(value){
            if(value < 0) {
                throw new Error('The age cannot be negative')
            }
        },
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('The email is not valid')
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value){
            if (value.length<7) {
                throw new Error('Password must be greater than 6 characters')
            }
            else if (value.includes('password')) {
                throw new Error('Password cannot contain password')
            }
        }
    },
    gender: {
        type: String,
        trim: true,
        default: 'Not specified',
        lowercase: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
userSchema.virtual('Tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
})
// Send public profile
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    //delete userObject.tokens;
    return userObject
}
// Set up logging in method
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email});
    if (!user) {
       throw new Error('Email and/or Password is incorrect');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
        throw new Error('Email and/or Password is incorrect');
    }
    return user;
}

// Set up authentication token
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString()}, 't-m-user' )

    this.tokens = this.tokens.concat({token})
    await this.save();
    return token;
}

// Hash password
userSchema.pre('save', async function(){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password,8)
    }
    console.log('About to save');

})

//Delete Tasks upon deleting User
userSchema.pre('remove', async function(next) {
    await Task.deleteMany({creator: this._id})
})

const User = mongoose.model('User',userSchema);

User.createIndexes();

module.exports = User
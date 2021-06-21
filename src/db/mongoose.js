const mongoose = require('mongoose');
const validator = require('validator')

const chalk = require('chalk')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    });

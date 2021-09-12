const mongoose = require('mongoose');
const validator = require('validator');
const Category = require('./category')
const {Timestamp} = require("mongodb");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: new Date()
    },
    startTime: {
        type: String,
        default: 'No time specified'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        ref: 'Category'
    }
}, {
    timestamps: true
})


taskSchema.pre('save', async function() {
    console.log(this.category)
    const existingCategory = await Category.findOne({categoryName: this.category})

    if (!existingCategory) {
        newCategory = new Category({categoryName: this.category})
        return await newCategory.save()
    }
    console.log('Category: ',existingCategory)

    const now = new Date();
    const nowDateTime = now.toISOString();
    const nowDate = nowDateTime.split('T')[0];
    this.dueDate = new Date(nowDate);
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task;


const mongoose = require('mongoose');
const validator = require('validator');
const Category = require('./category')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
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
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task;


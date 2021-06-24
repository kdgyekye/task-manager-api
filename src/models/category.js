const mongoose = require('mongoose')
const validator = require('validator')
const Task = require('./task')

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true
        },

    }
)
categorySchema.virtual('Tasks', {
    ref: 'Task',
    localField: 'categoryName',
    foreignField: 'category'
})

const Category = new mongoose.model('Category', categorySchema);

module.exports = Category;
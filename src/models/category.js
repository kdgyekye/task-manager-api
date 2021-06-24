const mongoose = require('mongoose')
const validator = require('validator')

const categoriesSchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true
        },

    }
)

const Category = new mongoose.model('Cateogry', categoriesSchema)
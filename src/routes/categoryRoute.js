const express = require('express')
const router = express.Router()
const Cateogry = require('../models/category')

router.post('/category', async(req,res) => {
    const category = new Category(req.body)

    try {
        newCategory = await category.save()
        res.status(201).send(newCategory)
    }catch (e) {
        res.status(500).send({error: 'COULD NOT ADD CATEGORY' +e})
    }
})
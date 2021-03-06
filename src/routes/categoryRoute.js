const express = require('express')
const Category = require('../models/category')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

router.post('/category', async(req,res) => {
    const category = new Category(req.body)

    try {
        newCategory = await category.save()
        res.status(201).send(newCategory)
    }catch (e) {
        res.status(500).send({error: 'COULD NOT ADD CATEGORY' +e})
    }
})

router.get('/categories', authMiddleware, async(req,res) => {
    try{
        const categories = await Category.find();
        res.status(200).send({categories})
    } catch (e) {
        res.status(500).send('AN ERROR OCCURED: '+e)
    }

})

router.get('/tasksCategories', authMiddleware, async(req,res) => {
    try {
        const categories = await Category.find();
        console.log(typeof(categories))
        if (Array.isArray(categories)) {
            const cTasks = await Promise.all(categories.map( async (category) => {
                await category.populate('Tasks').execPopulate();
                let categoryTasks = category.Tasks;
                return({
                    _id: category._id,
                    categoryName: category.categoryName,
                    tasks: categoryTasks
                })
            }))
            console.log('CTA: ',cTasks)
            res.status(200).send(cTasks)

        }

    }
    catch (e) {
        res.status(500).send('An error occured: '+e);
    }
})

router.get('/categories/:category', authMiddleware, async(req,res) => {
    try {
        category = await Category.findOne({categoryName: req.params.category})
        console.log(category)
        await category.populate({
            path: 'Tasks',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate();
        if (category.Tasks.length < 1) {
            res.status(404).send('There are no tasks under this category')
        }
        res.status(200).send(category.Tasks)
    } catch(e) {
        res.status(500).send('Something went wrong: '+e)
        console.log(e)
    }
})

module.exports = router
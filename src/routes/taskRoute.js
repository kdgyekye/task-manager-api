const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router()
const Task = require('../models/task')

router.post('/tasks', authMiddleware, async(req,res) => {
    const task = new Task({
        ...req.body,
        creator: req.profile._id
    })
    try{
        newTask = await task.save()
        res.status(201).send(newTask)
    }catch (e){
        res.status(500).send({error: 'COULD NOT ADD TASK! '+e})
    }
})

router.get('/tasks', authMiddleware, async(req,res) => {
    
    try {
        const match = {}
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        // const tasks = await Task.find({creator: req.profile._id})
        await req.profile.populate({
            path: 'Tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate();
        if (req.profile.Tasks.length<1) {
            return res.status(404).send('You have no tasks');
        }
        res.status(200).send(req.profile.Tasks);
    } catch (e) {
        res.status(500).send({error: 'AN ERROR OCCURED! '+e})
    }
})

router.get('/tasks/:id', authMiddleware, async(req,res) => {
    const _id = req.params.id
    try {
        task = await Task.findOne({_id, creator: req.profile._id});
        if (!task) {
            return res.status(404).send('TASK NOT FOUND!')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send({error: 'AN ERROR OCCURED! '+e})
    }
})

router.patch('/tasks/:id', authMiddleware, async(req,res) => {
    const _id = req.params.id;

    const allowedParams = ['description','completed'];
    const updateKeys = Object.keys(req.body);
    const validUpdate = updateKeys.every((key) => allowedParams.includes(key));

    if (!validUpdate) {
        return res.status(400).send({error: 'INVALID UPDATE KEYS!'})
    }

    try {
        //const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {new:true, runValidators: true});
        const updatedTask = await Task.findOne({_id, creator: req.profile._id});
        
        if (!updatedTask) {
            return res.status(404).send({error: 'COULD NOT FIND TASK TO UPDATE!'})
        }
        
        updateKeys.forEach((update) => updatedTask[update] = req.body[update]);
        updatedTask.save();

        res.status(200).send(updatedTask);
    } catch (error) {
        res.status(500).send({error: 'SOMETHING WENT WRONG! '+error})
    }
})

router.delete('/tasks/:id', authMiddleware, async(req,res) => {
    try {
        const deletedTask = await Task.deleteOne({_id: req.params.id, creator: req.profile._id});
        if (deletedTask.n === 0) {
            return res.status(404).send({error: 'USER NOT FOUND!'});
        }
        //await delete deletedTask;
        res.status(200).send(deletedTask)
    } catch (error) {
        res.status(500).send({error: 'SOMETHING WENT WRONG! '+error});
    }
})

module.exports = router;
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');
const {welcomeEmail} = require('../email/account')

router.post('/users', async (req,res) => {
    const newUser = new User(req.body);
    console.log(newUser);
    console.log(newUser.email, newUser.name.split(' ')[0])
    welcomeEmail(newUser.email, newUser.name.split(' ')[0])
    try{
        const userToken = await newUser.generateAuthToken()
        res.status(201).send({message: 'User created successfully',user: newUser, userToken})
    }catch (e){
        res.status(500).send({error: 'COULD NOT ADD USER!'+e})
    }
})
router.post('/users/logout', authMiddleware, async (req,res) => {
    try {
        req.profile.tokens = req.profile.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.profile.save()
        res.send('User logged out successfuly')
    } catch (error) {
        res.status(500).send({error: 'An error occured: '+error})
    }
})

router.post('/users/logoutAll', authMiddleware, async (req,res) => {
    try {
        req.profile.tokens = []
        await req.profile.save()
        res.send('User has been logged out of all sessions'+req.profile)
    } catch (error) {
        res.status(500).send({error: 'An error occured: '+error})
    }
})

router.get('/users/profile', authMiddleware, async (req,res) => {
    res.send(req.profile);
})


router.patch('/users/profile', authMiddleware, async(req,res) => {
    //const _id = req.params.id;

    const allowedParams = ['name','email','password','age','avatar'];
    const updateKeys = Object.keys(req.body);
     const validUpdate = updateKeys.every((key) => allowedParams.includes(key));

    if (!validUpdate) {
       return res.status(400).send({error: 'INVALID UPDATE KEYS!'})
    }

    try {
        updateKeys.forEach((update) => req.profile[update] = req.body[update]);
        await req.profile.save()
        res.status(200).send(req.profile);
    } catch (error) {
        res.status(400).send({error: 'SOMETHING WENT WRONG! '+error})
    }
})

const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('File must be an image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/profile/avatar', authMiddleware, upload.single('upload'), async (req,res) => {
    const avatarBuffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.profile.avatar = avatarBuffer
    await req.profile.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('Could not find user/image')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }
    catch (error) {
        res.status(404).send({error: 'NOT FOUND '+error})
    }

})

router.delete('/users/profile/avatar', authMiddleware, async(req,res) => {
    try {
        req.profile.avatar = undefined
        await req.profile.save()
        res.send()
    } catch (error) {
        res.status(500)
    }
})

router.delete('/users/profile', authMiddleware, async(req,res) => {
    try {
        await req.profile.remove()
        res.status(200).send(req.profile)
    } catch (error) {
        res.status(500).send({error: 'SOMETHING WENT WRONG! '+error});
    }
})
module.exports = router;
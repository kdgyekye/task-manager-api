const express = require('express');
require('./db/mongoose')
const userRouter = require('./routes/userRoute');
const taskRouter = require('./routes/taskRoute');
const User = require('./models/user');
 
const app = express();
const port = process.env.PORT || 8080

/*app.use((req,res,next) => {
    console.log({method: req.method, path: req.path});
    next();
})*/

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.post('/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send('An error occured: '+error);
    }
    
})

app.listen(port, () => {
    console.log('The server is listening on port '+port);
})
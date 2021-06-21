require ('../db/mongoose')
const Task = require('../models/task');

const deleteAndCount = async (id) => {
    const deleteTask = await Task.findByIdAndDelete(id);
    const countIncomplete = await Task.countDocuments({completed: false});
    return countIncomplete
}

deleteAndCount('60770f45c443644b50b13e93').then((countIncomplete) => {
    console.log('No. of Icomplete Tasks: ',countIncomplete)
}).catch((error) => console.log(error));
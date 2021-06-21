require('../db/mongoose')
const Task = require('../models/task');
const User = require('../models/user');

// Task.findByIdAndDelete('60770fbfafdd335a288f026c') .then((user) => {
//     console.log(user);
//     return Task.countDocuments(({completed: false})).then((incompleteTasks) => {
//         console.log(incompleteTasks)
//     }).catch((error) => console.log(error))
// })

const updateAgeAndCount = async (id,age) => {
    const updateUser = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count
}

updateAgeAndCount('6075d109f01ac646b034295c', 12).then((count) => {
    console.log('Count: ',count);
}).catch((error) => console.log(error)) 
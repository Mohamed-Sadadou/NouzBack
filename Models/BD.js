const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://Black:mongomdp@cluster0.c4jmi.mongodb.net/Accident', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    })
    .then(() => console.log('Connection a mongo effectuer avec succes'))
    .catch((err) => console.log('erreur de connection : ', err));
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/Utilisateur.Model');
const CODE ='Token_secret_Accident';
const url = require('url');
const maxAge = 24 * 60 * 60 * 100;


module.exports.ChekUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('on chek ce token :', token);
    if (token) {
        jwt.verify(token, CODE, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookies('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken._id);
                res.locals.user = user;
                console.log(user);
                next();
            }
        }
        )
    } else {
        console.log('mauvais token');
        res.locals.user = null;
        return res.status(201).json({ error: 'Utilisateur Non connecté !' });
    }
};


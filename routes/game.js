const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

router.get('/', ensureLoggedIn('/auth/login'), (req, res, next) => {
    Game.find()
        .then(games => {
            res.render('games/index', {games});
        })
        .catch(err => {
            console.log('Error in finding all games on /games: ', err);
            next();
        })
});

router.get('/create', ensureLoggedIn('/auth/login'), (req, res, next) => {
    res.render('games/create');
});

router.post('/create', ensureLoggedIn('/auth/login'), (req, res, next) => {
    const {name, description, category, minPlayers, maxPlayers, time, date, private} = req.body;
    let {equipment} = req.body;
    let equipmentObj = {};
    equipmentArr = equipment.split(',');
    equipmentArr.forEach(e => {
        equipmentObj[e] = null;
    })

    let newGame = new Game({
        name,
        description, 
        category, 
        minPlayers, 
        maxPlayers,
        time,
        date,
        equipment: equipmentObj,
        creatorId: req.session.passport.user
    })

    if(private){
        newGame.private = true;
    };

    newGame.save()
        .then(game => {
            // res.redirect(`/games/${game._id}`);
            res.redirect('/games');
        })
        .catch(err => {
            console.log('Error in saving new game created game.js: ', err);
            next();
        })
})

module.exports = router;
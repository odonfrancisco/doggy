const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

function checkCreator(id){
    return (req, res, next) => {
        Game.findById(req.params[id])
            .then(game => {
                if(game.creatorId == req.session.passport.user){
                    req.game = game;
                    return next();
                } else {
                    res.redirect(`/games/${game._id}`)
                }
            })
            .catch(err => {
                console.log('Error in finding game byId game.js to authorize user is creator: ', err);
                next();
            })
    }
}

function addGameReq(id){
    return (req, res, next) => {
        Game.findById(req.params[id])
            .then(game => {
                req.game = game;
                return next();
            })
            .catch(err => {
                console.log('Error in adding game to request game.js function addGameReq: ', err);
                next();
            })
    }
}

function capitalize(val) {
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1).toLowerCase();
}

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

// This only shows all the games a user is part of
router.get('/dashboard', ensureLoggedIn('/auth/login'), (req, res, next) => {
    Game.find({$or: [{creatorId: req.session.passport.user}, {players: {$in: [req.session.passport.user]}}]})
        .then(games => {
            res.render('games/dashboard', {games});
        })
        .catch(err => {
            console.log('Error in loading user\'s game dashboard game.js/dashboard: ', err);
            next();
        })
})

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
        creatorId: req.session.passport.user,
        players: [req.session.passport.user]
    })

    if(private){
        newGame.private = true;
    };

    newGame.save()
        .then(game => {
            res.redirect(`/games/${game._id}`);
            // res.redirect('/games');
        })
        .catch(err => {
            console.log('Error in saving new game created game.js: ', err);
            next();
        })
})

router.get('/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
    Game.findById(req.params.id).populate('players', 'username')
        .then(game => {
            if(game.creatorId == req.session.passport.user){
                game.admin = true;
            }
            const playersId = game.players.map(e => e._id.toString())
            if (playersId.indexOf(req.session.passport.user) > -1){
                game.player = true
            } else{
                game.notMember = true;
            }
            User.find({}, {username:1})
                .then(users => {
                    res.render('games/view', {game, users})
                })
                .catch(err => {
                    console.log('Error in finding all users for Player add dropdown game.js/:id', err);
                    next();
                })
        })
        .catch(err => {
            console.log('Error in finding particular game to display. game.js/:id:', err);
            next();
        })
})

router.get('/edit/:id', ensureLoggedIn('/auth/login'), checkCreator('id'), (req, res, next) => {
    // Passing the particular game in the request in the 'checkCreator' function
        // then making it equal to the game variable to pass to hbs
    const game = req.game;
    game.equipment = Object.keys(game.equipment).join();
    res.render('games/create', {game})
})

router.post('/edit/:id', ensureLoggedIn('/auth/login'), checkCreator('id'), (req, res, next) => {
    const {name, description, category, minPlayers, maxPlayers, time, date, private} = req.body;
    let {equipment} = req.body;
    let equipmentObj = {};
    equipmentArr = equipment.split(',');
    equipmentArr.forEach(e => {
        equipmentObj[e] = null;
    })

    Game.findByIdAndUpdate(req.params.id, {name, description, category, minPlayers, maxPlayers, time, date, private, equipment:equipmentObj})
        .then(game => {
            res.redirect(`/games/${game._id}`)
        })
        .catch(err => {
            console.log('Error in updating game when editing game.js/edit/:id : ', err);
            next();
        })
})

router.get('/delete/:id', ensureLoggedIn('/auth/login'), checkCreator('id'), (req, res, next) => {
    Game.findByIdAndRemove(req.params.id)
        .then(game => {
            res.redirect('/games');
        })
        .catch(err => {
            console.log('Error in deleting game. game.js/delete/:id', err);
            next();
        })
})

router.get('/players/add/:id', addGameReq('id'), (req, res, next) => {
    console.log(req.url)
    // Var for arrray of search queries for the Id of each user
    let allUsers = [];

    // Array which will hold all the user id's found
    let usersArray = [];

    // Var to hold promise statement if users are added to event.
    let find = new Promise((resolve, reject) => {resolve();});

    if (typeof(req.query.users)==='string'){
        const user = capitalize(req.query.users);
        console.log(user)
        find = User.findOne({username: user}, {_id:1})
            .then(user => {
                usersArray.push(user._id)
            })
            .catch(err => {
                console.log('Error finding single user to add to game game.js/players/add/:id', err);
            })
    }

    if (typeof(req.query.users)==='object'){
        req.query.users.forEach(e => {
            e = capitalize(e);
            userObj = {};
            userObj.username = e;
            allUsers.push(userObj)
        })
        userFind = {
            "$or": allUsers
        }

        find = User.find(userFind, {_id: 1})
            .then(users => {
                users.forEach(e => {
                    usersArray.push(e._id);
                });
            })
            .catch(err => {
                console.log('Error in finding multiple users to add to game game.js/players/add/:id', err);
            })
    }

    find.then(user => {
        console.log(req.game.players)
        if (usersArray.length > 0) req.game.players.unshift(...usersArray);
        req.game.save()
            .then(game => {
                // console.log('Game saves successfully: ', game);
                res.redirect(`/games/${game._id}`);
            })
            .catch(err => {
                console.log('Error in saving game after adding player game.js/players/add/:id ', err);
                next()
            })
    })
})

router.get('/players/delete/:gameId/:userId', checkCreator('gameId'), (req, res, next) => {
    req.game.players = req.game.players.filter(e => e===req.params.id)
    req.game.save()
        .then(game => {
            res.redirect(`/games/${game._id}`)
        })
        .catch(err => {
            console.log('Error in deleting player from game game.js/players/delete/:gameId/:userId', err);
            next();
        })
})


module.exports = router;
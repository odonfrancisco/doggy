const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Defines minimum and maximum number of 
        // players allowed
    minPlayers: Number,
    maxPlayers: Number,
    location: {
        type: {type: String},
        coordinates: [Number],
    },
    // Time for the game to take place
    time: String,
    // Description of game to be played
    description: String,
    // Equipment necesarry and the users who
        // will supply said equipment
    equipment: Schema.Types.Mixed,
    // Array of players' IDs
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Comments on the game posted by the players
        // before and after the game
    discussion: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // Sets whether game should be publicly accessed or not
    private: boolean
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
})

gameSchema.index({locations: '2dsphere'})

const Game = mongoose.model('game', gameSchema);
module.exports = Game;
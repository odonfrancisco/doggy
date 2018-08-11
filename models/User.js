const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

function capitalize(str){
  return str[0].toUpperCase()+ str.substring(1).toLowerCase()
}

const userSchema = new Schema({
  username: {
    type: String,
    set: capitalize
  },
  password: String,
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

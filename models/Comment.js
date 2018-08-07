const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newComment = new Schema({
    content: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
})

const Comment = mongoose.model('comment', newComment);
module.exports = Comment;
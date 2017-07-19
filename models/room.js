import mongoose from 'mongoose';

var roomSchema = new mongoose.Schema({
  roomNumber: Number,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

export default mongoose.model('Room', roomSchema);

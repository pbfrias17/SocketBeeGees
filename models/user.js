import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  roomNumber: Number,
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);
export default User;

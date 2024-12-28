const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    }
});
 module.exports =  mongoose.model('User',UserSchema);

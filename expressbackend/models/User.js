let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let jwt = require('jsonwebtoken');
let mongoosePaginate = require('mongoose-paginate');

const userSchema = Schema({
    firstname : {
        type : String
    },
    ////contact us api test///
    fullName : {
        type : String
    },
    message : {
        type : String
    },
    mobile : {
        type : String
    },
    Subject : {
        type : String
    },
    /////////////////////end///////
    lastname : {
        type : String
    },
    email : {
        type : String,
        lowercase: true,
        index: true
    },
    salt : {
        type : String
    },
    hash : {
        type : String
    },
    
    socialid : {
        type : String,
        default : null
    },
    activationnumber : {
        type : Number,
        default : 0
    },
    role : {
        type : String,
        default : 'user'
    },
    
    provider : {
        type : String,
        default : 'local'
    },
    
    isactivated : {
        type : Boolean,
        default : true
    },
    isverified : {
        type : Boolean,
        default : false
    },
    gender : {
        type : String,
    },
    state: {
        type : String,
    },
     city: {
        type : String,
    },
    address : {
        type : String,
    },
    mobilenumber : {
        type : String,
       // match : /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    },
    officenumber : {
        type : String,
        // match : /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    },
    jobtitle :{
        type:String,
    },
    isdeleted : {
        type : Boolean,
        default : false
    }
},{ timestamps : true });

userSchema.plugin(mongoosePaginate);

userSchema.methods.generateAuthToken = function(){
    // const token = jwt.sign({ _id : this.id , exp: Math.floor(Date.now() / 1000) + (60 * 60)*2  },process.env.secret);
    const token = jwt.sign({ _id : this.id },"jwtPrimaryKey");
    return token;
}



module.exports = mongoose.model('User',userSchema);

let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');
let request = require('request');
let User = require('../models/User');
let async=require('async');
var express = require('express');

const path = require('path');
const fs = require('fs');

const multer = require('multer');
const bodyParser = require('body-parser');
const DIR = './uploads';
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

var router = express.Router();
exports.signUp = async (req, res) => {
    try {
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let password = req.body.password;
        let confirmpassword = req.body.confirmpassword;
        let mobilenumber = req.body.mobilenumber;
        let gender = req.body.gender;
        let city = req.body.city;
        let state = req.body.state;
        if (!firstname) {
            return res.status(400).json({
                code: 400,
                message: 'First name is required',
                data: []
            });
        }
        else if (!lastname) {
            return res.status(400).json({
                code: 400,
                message: 'Last name is required',
                data: []
            });
        }
        else if (!email) {
            return res.status(400).json({
                code: 400,
                message: 'Email is required',
                data: []
            });
        }
        else if (!password) {
            return res.status(400).json({
                code: 400,
                message: 'Password is required',
                data: []
            });
        }
        else if(!mobilenumber){
            return res.status(400).json({
                code : 400,
                message : 'mobilenumber is required',
                data : []
            });
        }
        else if(!gender){
            return res.status(400).json({
                code : 400,
                message : 'gender is required',
                data : []
            });
        }
        else if(!state){
            return res.status(400).json({
                code : 400,
                message : 'state is required',
                data : []
            });
        }
        else if(!city){
            return res.status(400).json({
                code : 400,
                message : 'city is required',
                data : []
            });
        }
        else {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Try with new email,user already exists',
                    data: []
                });
            }
            else {
                createNewUser();
            }
            async function createNewUser() {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
                const activationnumber = Math.floor((Math.random() * 546795) + 54);
                const newUser = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    mobilenumber : mobilenumber,
                    gender:gender,
                    city: city,
                    state :state,
                    salt: salt,
                    hash: hashed,
                    activationnumber: activationnumber,


                });
                let newuser = await newUser.save();
                if (!newuser) {
                    return res.status(400).json({
                        code: 400,
                        message: 'Error in creating user profile',
                        data: []
                    });
                }
                else {
                    let link = `http://localhost:3000/api/users/verifyaccount?activationnumber=${activationnumber}&email=${email}`;
                    //  NodeMailer : To send email
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'dheerajkarki27@gmail.com',
                            pass: 'dheeraj@dit123'
                        }
                    });
                    let mailOptions = {
                        from: 'dheerajkarki27@gmail.com',
                        to: email,
                        subject: ' application activation link',
                        // html: "Welcome to Loan application",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify your account.</a>"
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            console.log('Email not sent...error');
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    // setTimeout(async () => {
                    //     await User.findOneAndUpdate({email : email}, {$set:{activationnumber : null}});
                    //     console.log("link exp>>>>>>>>>>>>>>>");
                    // },600000);

                    return res.status(200).json({
                        code: 200,
                        message: 'Your account has been created successfully.Now click on the link sent in email to verify your account',
                        data: []
                    });
                }
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        })
    }
}
/////set password/////
exports.setPassword = async (req, res) => {
    try {
        // console.log(req.body, '----------------->>>>>>>>>>>');
        let email = req.body.email;
        let activationnumber = req.body.activationnumber;

        let user = await User.findOne({ email: email, isdeleted: false, activationnumber: activationnumber });
        if (user) {
            console.log(user.activationnumber, ' ----->>');
            return res.status(200).json({
                code: 200,
                message: "Set new password now",
                data: []
            });
        }
        else {
            return res.status(401).json({
                code: 401,
                message: 'Unauthorized access',
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        })
    }
}

exports.postSetPassword = async (req, res) => {
    try {
        // console.log(req.body,'=======>>>>>');
        let email = req.body.email;
        let password = req.body.password;
        let user = await User.findOne({ email: email, isdeleted: false });
        if (user) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const activationnumber = Math.floor((Math.random() * 546795) + 54);
            let updateuser = await User.findOneAndUpdate({ email: email, isdeleted: false }, { $set: { salt: salt, hash: hash, activationnumber: activationnumber, isverified: true } });
            if (updateuser) {
                const token = user.generateAuthToken();
                return res.header('x-auth-token', token).json({
                    code: 200,
                    message: 'User signin success',
                    data: user,
                    token: token
                });
            }
            else {
                return res.status(404).json({
                    code: 404,
                    message: 'Error in creating password',
                    data: []
                });
            }
        }
        else {
            return res.status(404).json({
                code: 404,
                message: 'Email not found',
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        })
    }
}

/////verify email///////
exports.verifyAccount = async (req, res) => {
    try {
        let email = req.query.email;
        let activationnumber = parseInt(req.query.activationnumber);
        if (!email) {
            return res.status(400).json({
                code: 400,
                message: "Email cannot be blank",
                data: []
            });
        }
        if (!activationnumber) {
            return res.status(400).json({
                code: 400,
                message: "Activation number cannot be blank",
                data: []
            });
        }
        let verifyuser = await User.findOneAndUpdate({ email: email, activationnumber: activationnumber, isdeleted: false }, { $set: { isverified: true, activationnumber: null } });
        if (verifyuser) {
            return res.status(200).json({
                code: 200,
                message: 'Your account is now verified by email.Just login to the website now',
                data: []
            });
        }
        else {
            return res.status(400).json({
                code: 400,
                message: 'Something went wrong,Error in account verification',
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        })
    }
}


//login/////
exports.signIn = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email) {
            return res.status(400).json({
                code: 400,
                message: 'Email cannot be blank',
                data: []
            });
        }
        else if (!password) {
            return res.status(400).json({
                code: 400,
                message: 'Password cannot be blank',
                data: []
            });
        }
        else {
            let user = await User.findOne({ email: email, isdeleted: false });
            if (user) {
                if (user.provider == 'local') {
                    if (user.isverified) {
                        bcrypt.compare(password, user.hash, (err, result) => {
                            if (result) {
                                // if(user.isverified && (user.activationnumber == null)){
                                if (user.isactivated) {
                                    const token = user.generateAuthToken();
                                    return res.header('x-auth-token', token).json({
                                        code: 200,
                                        message: 'User signin success',
                                        data: user,
                                        token: token
                                    });
                                }
                                else {
                                    return res.status(401).json({
                                        code: 401,
                                        message: 'Your account is deactivated,please contact admin',
                                        data: []
                                    });
                                }
                            }
                            else {
                                return res.status(401).json({
                                    code: 401,
                                    message: 'Invalid Password',
                                    data: []
                                });
                            }
                        });
                    }
                    else {
                        return res.status(401).json({
                            code: 401,
                            //message: 'Password not set,Click on the link sent in email to set your password',
                            message: 'Your account is not verified by email.Just verify your email now',
                            data: []
                        });
                    }
                }
                if (user.provider == 'google') {
                    return res.status(422).json({
                        code: 422,
                        message: "Email registered with Google.Try using 'Login with Google' ",
                        data: []
                    });
                }
            }
            else {
                return res.status(404).json({
                    code: 404,
                    message: 'Email not found.Try login using a valid email address',
                    data: []
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        });
    }
}

//forgot password///////
exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body, '  00000====');
        let email = req.body.email;
        if (!email) {
            return res.status(404).json({
                code: 404,
                message: 'Email cannot be blank',
                data: []
            });
        }
        const activationnumber = Math.floor((Math.random() * 484216) + 54);
        let user = await User.findOne({ email: email, isdeleted: false });
        if (user) {
            let updateuser = await User.findOneAndUpdate({ email: email, isdeleted: false }, { $set: { activationnumber: activationnumber } });
            if (updateuser) {
                let link = `http://localhost:4500/users/setpassword?activationnumber=${activationnumber}&email=${email}`;
                // let link = `http://54.71.18.74:4504/#/setpassword?activationnumber=${activationnumber}&email=${email}`;

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dheerajkarki27@gmail.com',
                        pass: 'dheeraj@dit123'
                    }
                });
                let mailOptions = {
                    from: 'dheerajkarki27@gmail.com',
                    to: email,
                    subject: ' application forgot password link',
                    // html: "Welcome to Loan application",
                    html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to reset password of your account.</a>"
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        console.log('Email not sent...error');
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json({
                    code: 200,
                    message: 'Check your email and reset your password now',
                    data: []
                });
            }
            else {
                return res.status(404).json({
                    code: 404,
                    message: 'Email not found22',
                    data: []
                });
            }
        }
        else {
            return res.status(404).json({
                code: 404,
                message: 'Email not found44',
                data: []
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        })
    }
}


exports.findAllUser = (req, res) => {
    try {
        User.find()
            .then(result => {
                //API return type (response format)
                var userResponse = {
                    message: "success",
                    userId: 0,
                    statusCode: 200,
                    userData: result
                }
                return res.status(200).send({ userResponse });
            })
    } catch (error) {
        var userResponse = {
            message: "error",
            userId: 0,
            statusCode: 500,
            userData: null
        }
        return res.status(500).send({ userResponse });
    }

};

exports.getMyProfile = async (req,res)=>{
    try{
        // console.log(req.user,"user");
        let loggedInUser = req.user._id;
        // console.log(loggedInUser,' ------=====');
        let user = await User.findOne({_id : loggedInUser, isdeleted : false}).populate({ path : 'loans' , populate : { path : 'loantypeselected' } });
        if(user){
            return res.status(200).json({
                code : 200,
                message : 'User profile found',
                data : user
            });
        }
        else{
            return res.status(404).json({
                code : 404,
                message : 'User profile not found',
                data : []
            });
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({
            code : 500,
            message : 'Something went wrong,Try after sometime',
            data : []
        })
    }
}

/////////edit user///////
exports.editUser = async (req,res)=>{
    console.log("@@@@@@@@@",req.body)
    console.log("flee", req.file);
    try{
        let loggedInUser = req.user._id;
        let user = await User.findOne({ _id : loggedInUser , isdeleted : false });
        if(user){
            let email = req.body.email;
            let edituser = req.body;
           

            /////////upload file///////////
            
 /////////////////////////////////////////////////////////
            let updateuser = await User.findOneAndUpdate({ email : email, isdeleted : false },{ $set : edituser } );
            if(updateuser){
                return res.status(200).json({
                    code : 200,
                    message : 'User updated successfully',
                    data : []
                });
            }
            else{
                return res.status(404).json({
                    code : 404,
                    message : 'User email not found',
                    data : []
                });
            }
        }
        else{
            return res.status(404).json({
                code : 404,
                message : 'Error.You are not a valid user',
                data : []
            });
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({
            code : 500,
            message : 'Something went wrong in editing user,Try after sometime',
            data : []
        });
    }
}

////social login///////////
exports.socialSignIn = async (req,res)=>{
    console.log("in fun ------------------------------",req.body)

    try{
        let id = req.body.social_id;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
       // let name = req.body.name;
        let email = req.body.email;
        let image = req.body.image;
        let provider = req.body.provider;
        let token = req.body.token;
        // console.log(token,'----');
        if(!firstname){
            return res.status(400).json({
                code : 400,
                message : 'firstName cannot be blank',
                data : []
            });
        }
         
        else if(!lastname){
            return res.status(400).json({
                code : 400,
                message : 'lastname cannot be blank',
                data : []
            });
        }

        else if(!email){
            return res.status(400).json({
                code : 400,
                message : 'Email cannot be blank',
                data : []
            });
        }
        else if(!provider){
            return res.status(400).json({
                code : 400,
                message : 'Provider cannot be blank',
                data : []
            });
        }
        else if(!token){
            return res.status(400).json({
                code : 400,
                message : 'Token cannot be blank',
                data : []
            });
        }
        else{
            if(provider == 'google'){
                let verifyGoogleUser = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token;
                request(verifyGoogleUser,function(error,response,body){
                    if(response && response.statusCode === 200 ){
                        let info = JSON.parse(body);
                        User.findOne({ socialid : id, email : email ,isdeleted : false }).then(
                            (user)=>{
                                if(user){
                                    const token = user.generateAuthToken();
                                    return res.header('x-auth-token',token).json({
                                        code : 200,
                                        message : 'Social signin sucess',
                                        data : user,
                                        token : token
                                    });
                                }
                                else{
                                    createNewSocialUser();
                                }
                            }
                        ).catch((err) => {
                            console.error("Error occured ",+err);
                            return res.status(500).json({
                                code : 500,
                                message : 'Something went wrong,Try after sometime',
                                data : [err]
                            });
                        });
                    }
                    else{
                        return res.status(401).json({
                            code : 401,
                            message : 'You are not an authorized google user',
                            data : []
                        });
                    }
                    // console.log('body: ', body);
                    // console.log('error:', error);
                    // console.log('statusCode:', response && response.statusCode);
                });
            }
            // if(provider == 'facebook'){
            //     let verifyFacebookUser = 'https://graph.facebook.com/me?access_token='+token;
            //     request(verifyFacebookUser,function(error,response,body){
            //         let info = JSON.parse(body);
            //         console.log(info,'-----');
            //         if(info.id == id){
            //             User.findOne({ socialId : id, email : email }).then(
            //                 (user)=>{
            //                     if(user){
            //                         const token = user.generateAuthToken();
            //                         return res.header('x-auth-token',token).json({
            //                             code : 200,
            //                             message : 'Signin success',
            //                             data : user,
            //                             token : token
            //                         });
            //                     }
            //                     else{
            //                         createNewSocialUser();
            //                     }
            //                 }
            //             ).catch((err) => {
            //                 console.error("Error occured ",+err);
            //                 return res.status(500).json({
            //                     code : 500,
            //                     message : 'Something went wrong,Try after sometime',
            //                     data : []
            //                 });
            //             });
            //         }
            //         else{
            //             return res.status(401).json({
            //                 code : 401,
            //                 message : 'You are not an authorized facebook user',
            //                 data : []
            //             });
            //         }
            //     });
            // }
            else{
                return res.status(422).json({
                    code : 422,
                    message : 'Social provider not found.Try again after sometime',
                    data : []
                });
            }
        }
    
        async function createNewSocialUser() {
    
            const newUser = new User({
                socialid : id,
                firstname : firstname,
                email : email,
                // image : image,
                provider : provider,
                isverified : true
            });
            let newuser = await newUser.save();
                if(newuser){
                    const token = newuser.generateAuthToken();
                    return res.header('x-auth-token',token).json({
                        code : 200,
                        message : 'Social signup success',
                        data : newuser,
                        token : token
                    });
                }
                else{
                    return res.status(400).json({
                        code : 400,
                        message : 'Error occured in social signin',
                        data : []
                    });
                };
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({
            code : 500,
            message : 'Something went wrong,Try after sometime',
            data : []
        })
    }
}

User.
  findOne({ name: 'Val' }).
  populate({
    path: 'friends',
    populate: { path: 'friends' }
  });


  ///////delete user by id ///////
  exports.deleteUser = (req, res) => {
    //   console.log(req,req.body, req.params ,"rrrrrrrrrrrrrrr")
    // User.findOneAndRemove({ _id : req.query._id })
    console.log(req.query.id);
    User.findOneAndRemove({ _id : req.query.id })
        .then(result => {
            User.find({}).then(resx => {
                var userResponse = {
                    message: "success",
                    userId: 0,
                    statusCode: 200,
                    userData: resx
                }
                return res.status(200).send({ userResponse });
            })
            //API return type (response format)
        }).catch(err => {
            //API return type (response format)
            var userResponse = {
                message: "error",
                userId: 0,
                statusCode: 500,
                userData: null
            }
            return res.status(500).send({ userResponse });
        });
};

exports.confirmPayment = async(res,req)=>{
    const token = req.body._id;
    stripe.charges.create({
        amount:999,
        currency:'usd',
        description:'Example charges',
        source:token,
        capture:false
    })
    .then (resx=>{
        return res.status(200).json({sucess:'payment done'});
    })
    .catch(err =>{
        res.status(500).json({'error':err});
    });

} ;
/////////////////contactus////////////////////


// exports.contactus = async (req, res,done) => {
//     try{
//         console.log("bodydataata",req.body)
//         async.waterfall([
            
//             function(done) {
//                 console.log("hellooooooooo11");
//             var transporter = nodemailer.createTransport({
//               host: 'smtp.gmail.com',
//                port: 465,
//                 secure: true, // use TLS
//                  auth: {
//                         user:'dsktesting27@gmail.com',
//                         pass:'dsk@27testing'
//                        }
//         // tls: {
//             //do not fail on invalid certs
//             // rejectUnauthorized: false
//         // }
       
//       })
//       console.log("hellooooooooo222")
//               var mailOptions = {
                
//                 from: req.body.Name + req.body.Email,
//                 to: 'test001@mailinator.com',
//                 subject: req.body.Email,
//                 text: "Name: " + req.body.fullName + "Email: "  + req.body.email +
//                       "Contact No:  " + req.body.mobile +"Subject: "+req.body.Subject+ "QUERY: " + req.body.message
//               };
             
//               transporter.sendMail(mailOptions, function (err) {
//                 console.log(err);
               
//                 req.flash('success', 'Success!');
//                 done(err);
//               });
//               console.log("hellooooooooo33333")
//       // callback(null, 'one', 'two');
//             },
           
//             function(done) {
//                 var host = 'smtp.gmail.com'
//                 console.log("hellooooooooo44444")
//                   var transporter = nodemailer.createTransport({
//               host: 'smtp.gmail.com',
//                port: 465,
//                 secure: true, // use sTLS
//                  auth: {
//                         user:'dsktesting27@gmail.com',
//                         pass:'dsk@27testing'
//                        }
//         // tls: {
//             //do not fail on invalid certs
//             // rejectUnauthorized: false
//         // }
//       })
     
//               var mailOptions = {
//                 to: req.body.email,
//                 from: 'dsktesting27@gmail.com',
//                 subject: 'Thank you for Contactus',
//                 text:"Hello <strong>"+req.body.fullName+"</strong><br>Thank you for Contact us your query will be processed shortly."
                
//                 //text: 'Hello''<strong>'+req.body.Email+'</strong>''<br>''At A2Z Heavy Equipment, we are committed to delighting you with our products and services every time you visit us. We promise you best sellers and services for:'
//               };
//               transporter.sendMail(mailOptions, function (err) {
//                  console.log(err)
//                  console.log("hellooooooooo")
//                 req.flash('success', 'Success! your query will be processed shortly');
//                 done(err);
//               });
//             },
//         ], function (err) {
//             // res.redirect('/contactus');
//              return res.status(500).json({
//               code : 500,
//               message : 'ry again after sometime',
//               data : []
//           });
//          });
       
//     }catch(err) {
//         console.error(err);
//         return res.status(500).json({
//             code: 500,
//             message: 'Something went wrong,Try after sometime',
//             data: []
//         });
//     }
// }

exports.contactus = async (req, res) => {
    try{
        console.log("bodydataata",req.body)
        let mailOpts, smtpTrans;
        smtpTrans = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'dsktesting27@gmail.com',
            pass: 'dsk@27testing',
          }
        });
        mailOpts = {
          from: req.body.fullName + ' &lt;' + req.body.email + '&gt;',
          to: 'dsktesting27@gmail.com',
          cc: req.body.email,
          subject: 'New message from contact form',
          text: `${req.body.fullName} (${req.body.email}) says: ${req.body.message}`
        };

        var mailOptions = {
                       to: req.body.email,
                       from: 'dsktesting27@gmail.com',
                       subject: 'Thank you for Contactus',
                       text:"Hello <strong>"+req.body.fullName+"</strong><br>Thank you for Contact us your query will be processed shortly."
                       
                       //text: 'Hello''<strong>'+req.body.Email+'</strong>''<br>''At A2Z Heavy Equipment, we are committed to delighting you with our products and services every time you visit us. We promise you best sellers and services for:'
                     };
      
        
        
        smtpTrans.sendMail(mailOpts, function (error, response) {
           
          if (error) {
            res.render('contact-failure');
          }
          else {
            res.render('contact-success');
            
          }
        });
      
    }catch(err) {
        
        return res.status(500).json({
            code: 500,
            message: 'Something went wrong,Try after sometime',
            data: []
        });
    }
}

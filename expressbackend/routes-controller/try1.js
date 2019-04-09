let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');
let User = require('../modes/User');
let request = require('request');

// exports.signup = async(res ,req)=>{
//     try{
//         let firstname= req.body.firstname;
//         let lastname =req.body.lastname;
//         let email = req.body.email;
//         let password= req.body.password;

//         if(!firstname){
//             return res.status(400).json({
//                 code :400,
//                 message:"firstname can not be blank",
//                 data:[]
//             });
//         }
//         else if(!lastname){
//             return res.status(400).json({
//                 code:400,
//                 message:"lastname cannot be blank",
//                 data:[]
//             })
//         }
//         else if(!email){
//             return res.status(400).json({
//                 code:400,
//                 message:"email cannot be blank",
//                 data:[]
//             })
//         }
//         else if(!password){
//             return res.status(400).json({
//                 code:400,
//                 message:"password cannot be blank",
//                 data:[]
//             })
//         }
//         else{
//             let user= await User.findOne({email:email});
//             if(user){
//                 return res.status(400).json({
//                     code:400,
//                     message:'try with new email ,email id already exist',
//                     data:[]
//                 });
//             }
//             else{
//                 createNewUser();
//             }
//             async function createNewUser(){
//                 const salt = await bcrypt.genSalt(10);
//                 const hashed = await bcrypt.hash(password, salt);
//                 const activationnumber = Math.floor((Math.random() * 546795) + 54);
//                 const newUser= new User({
//                     firstname:firstname,
//                     email:email,
//                     salt:salt,
//                     hash:hashed,
//                     activationnumber:activationnumber,
//                 });
//                 let newuser = await newUser.save();
//                 if(!newuser){
//                     return res.status(400).json({
//                         code:400,
//                         message:'Error in creating User profil',
//                         data:[],
//                     });
//                 }
//                 else{
//                     let link = `http://localhost:3000/api/users/verifyaccount?activationnumber=${activationnumber}&email=${email}`;
//                     //  NodeMailer : To send email
//                     let transporter = nodemailer.createTransport({
//                         service: 'gmail',
//                         auth: {
//                             user: 'dheerajkarki27@gmail.com',
//                             pass: 'dream@4u'
//                         }
//                     });
//                     let mailOptions = {
//                         from: 'dheerajkarki27@gmail.com',
//                         to: email,
//                         subject: ' application activation link',
//                         // html: "Welcome to Loan application",
//                         html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify your account.</a>"
//                     };
//                     transporter.sendMail(mailOptions, function (error, info) {
//                         if (error) {
//                             console.log(error);
//                             console.log('Email not sent...error');
//                         }
//                         else {
//                             console.log('Email sent: ' + info.response);
//                         }
//                     });
//                     // setTimeout(async () => {
//                     //     await User.findOneAndUpdate({email : email}, {$set:{activationnumber : null}});
//                     //     console.log("link exp>>>>>>>>>>>>>>>");
//                     // },600000);

//                     return res.status(200).json({
//                         code: 200,
//                         message: 'Your account has been created successfully.Now click on the link sent in email to verify your account',
//                         data: []
//                     });
//                 }
//         }
//     }
// }
//     catch(err){
//         return res.status(500).json({
//             code:500,
//             message:'something went wrong try after sometime',
//             data:[]
//         });
//     }
// }
// exports.signIn = async (res, req) => {
//     try {
//         let email = req.body.email;
//         let password = req.body.password;
//         if (!email) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "email can not be blank",
//                 data: []
//             });
//         }
//         else if (!password) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "password can not be blank",
//                 data: []

//             });
//         }
//         else {
//             let user = await User.findOne({ email: email, isdeleted: false })
//             if (user) {
//                 if (user.provider == "local") {
//                     if (user.isverified) {
//                         bcrypt.compare(password, user.hash, (err, result) => {
//                             if (result) {
//                                 if (user.isactivated) {
//                                     const token = user.generateAuthToken();
//                                     return res.header('x-auth-token', token).json({
//                                         code: 200,
//                                         message: "user signIn sucess",
//                                         data: user,
//                                         token: token,
//                                     });
//                                 }
//                                 else {
//                                     return res.status(401).json({
//                                         code: 401,
//                                         message: 'Your account is deactivated,please contact admin',
//                                         data: []
//                                     });
//                                 }
//                             }
//                             else {
//                                 return res.status(400).json({
//                                     code: 400,
//                                     message: 'invalid password',
//                                     data: [],
//                                 });
//                             }
//                         });
//                     }

                   
//                 else {
//                     return res.status(401).json({
//                         code: 400,
//                         message: 'Your account is not verified by email.Just verify your email now',
//                         data: [],
//                     });
//                 }
//             }
//             if (user.provider == 'google') {
//                 return res.status(422).json ({
//                     code: 422,
//                     message: "Email registered with Google.Try using 'Login with Google' ",
//                     data: []
//                 });
//             }
//         }
//          else{
//             return res.status(404).json({
//                 code: 404,
//                 message: 'Email not found.Try login using a valid email address',
//                 data: []
//             });
//         }
//     }
// }
//  catch(err) {
//         console.error(err);
//         return res.status(500).json({
//             code: 500,
//             message: 'Something went wrong,Try after sometime',
//             data: []
//         });
//     }
// }

// exports.deleteUser =async(req,res)=>{
    
//         User.findOne({id:req.query.id})
//         .then(result=>{
//             User.find({}).then(resx=>{
//                 return res.status(500).json({
//                     code:500,
//                     message:'sucess',
//                     data:[res],
//                 });
            
//         })
//     }).catch(err=>{
//         console.error(err);
//         return res.status(500).json({
//             code: 500,
//             message: 'Something went wrong,Try after sometime',
//             data: []
//         });
//     })
// }
// exports.saveMessage=async(res,req)=>{
    
//             let fullName = req.body.fullName;
//             let email = req.body.email;
//             let mobile = req.body.mobile;
//             let subject = req.body.subject;
//             let message =req.body.message;
//             if (!fullName) {
//                 return res.status(400).json({
//                     code: 400,
//                     message: 'First name is required',
//                     data: []
//                 });
//             }
           
//             else if (!email) {
//                 return res.status(400).json({
//                     code: 400,
//                     message: 'Email is required',
//                     data: []
//                 });
//             }
//             else if (!mobile) {
//                 return res.status(400).json({
//                     code: 400,
//                     message: 'mobile is required',
//                     data: []
//                 });
//             }
//             else if(!subject){
//                 return res.status(400).json({
//                     code : 400,
//                     message : 'subject is required',
//                     data : []
//                 });
//             }
//             else if(message != confirmpassword){
//                 return res.status(400).json({
//                     code : 400,
//                     message : 'message is required',
//                     data : []
//                 });
//             }
//             else{
//                 User.save().then(result=>{
//                     return res.status(200).json({
//                         code:200,
//                         message:'sucess',
//                         data:[]
//                     });
//                 })
//                 .catch(err => {
//                     return res.status(500).json({
//                         code:500,
//                         message:'error',
//                         data:[]
//                     });
//                 });
              
     
       
//     }
// }



var express = require('express');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// router.post('/contactus', function(req,res){
//   console.log("datatasta", req.body);
//   async.waterfall([
//         function(done) {
//         var transporter = nodemailer.createTransport({
//           host: 'smtp.gmail.com',
//            port: 465,
//             secure: true, // use TLS
//              auth: {
//               user:'dsktesting27@gmail.com',
//               pass:'dsk@27testing'
//                    }
//     // tls: {
//         //do not fail on invalid certs
//         // rejectUnauthorized: false
//     // }
// })
//           var mailOptions = {
//             from: req.body.Name + req.body.Email,
//     		to: 'abhi@mailinator.com',
//             subject: req.body.Email,
//             text: "Name: " + req.body.fname + "Email: "  + req.body.email +
//     		      "Contact No:  " + req.body.phone + "QUERY: " + req.body.Msg
//           };
//           transporter.sendMail(mailOptions, function (err) {
// 			console.log(err);
//             req.flash('success', 'Success! Your password has been changed.');
//             done(err);
//           });

// // callback(null, 'one', 'two');
//         },
//         function(done) {
			
//               var transporter = nodemailer.createTransport({
//           host: 'smtp.gmail.com',
//            port: 465,
//             secure: true, // use TLS
//              auth: {
//               user:'dsktesting27@gmail.com',
//               pass:'dsk@27testing'
//                    }
//     // tls: {
//         //do not fail on invalid certs
//         // rejectUnauthorized: false
//     // }
// })
//           var mailOptions = {
//             to: req.body.email,
//             from: 'dsktesting27@gmail.com',
//             subject: 'Thank you for signing up at <a href="a2zheavyequipment.com">a2zheavyequipment.com</a>',
//             text:"Hello <strong>"+req.body.fname+"</strong><br>Thank you for signing up at <br>At <strong>A2Z Heavy Equipment</strong>, we are committed to delighting you with our products and services every time you visit us. We promise you best sellers and services for:<ul><li>Sale or Buy a New Equipment</li><li>Sale or Buy an Used/Old Equipment</li><li>Rent your Equipment or Hire a machine</li><li>Sale or Buy Spare Parts for your machineries</li><li>Repair Equipment or Get your equipment repaired & much more</li></ul><br>Our customer service team is committed to help you with all your needs 10-5pm.<br> You can reach them online via chat email at support@a2zheavyequipment.com.<br> Thank you once again! "
			
// 			//text: 'Hello''<strong>'+req.body.Email+'</strong>''<br>''At A2Z Heavy Equipment, we are committed to delighting you with our products and services every time you visit us. We promise you best sellers and services for:'
//           };
//           transporter.sendMail(mailOptions, function (err) {
// 			 console.log(err)
//             //req.flash('success', 'Success! your query will be processed shortly');
//             done(err);
//           });
//         },
//     ], function (err) {
//       console.log("error", err);
//         //res.redirect('/contactus');
//     });

// })

module.exports = router;

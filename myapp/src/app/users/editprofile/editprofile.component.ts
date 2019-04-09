import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/shared/services/jwt.service';
import{ AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3000/api/users/edituser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import * as AWS from 'aws-sdk';
// import AWS from 'aws-sdk/dist/aws-sdk'

// let s3 = new AWS.S3({
//     accessKeyId: '',
//     secretAccessKey: ''
// });

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
})
export class EditprofileComponent implements OnInit {
    
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
    title = 'Finmae.com';
    oneuser: any;
    editUserForm: FormGroup;
    editUserData: any;
    changePass: boolean;
    changePasswordForm: FormGroup;
    changePasswordData: any;
    editProfileFail: boolean = false;
    imageFile: any;

    passwordFail: boolean = false;
    passwordMatchFail: boolean = false;
    oldpassword: any;
    newpassword: any;
    confirmnewpassword: any;
    id: any;
  constructor(private jwtService : JwtService,
              private authService : AuthService,
              private router: Router,
              private toasterService : ToasterService,
              private fb : FormBuilder,) {
    this.editUserForm = fb.group({
      "firstname" : ['',Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
      ])],
      "lastname" : ['',Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
      ])],
      "email" : ['',Validators.compose([
          Validators.required,
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])],
      "gender" : ['',Validators.compose([
          // Validators.minLength(4),
          // Validators.required,
      ])],
      "jobtitle" : ['',Validators.compose([
          // Validators.minLength(4),
          // Validators.required,
      ])],
      "mobilenumber" : ['',Validators.compose([
          Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
          // Validators.minLength(4),
           Validators.required,
      ])],
      "state" : ['',Validators.compose([
         // Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
          // Validators.minLength(4)
          Validators.required,
      ])],
      "city" : ['',Validators.compose([
          // Validators.minLength(4),
          Validators.required,
      ])],
      "uploader" : ['',Validators.compose([
         
      ])],
      "licensenumber" : ['',Validators.compose([
          // Validators.minLength(4),
          // Validators.required,
      ])],
      "emailsignature" : ['',Validators.compose([
          // Validators.minLength(4)
      ])],
      "emailsignatureimage" : ['',Validators.compose([
        // Validators.minLength(4)
    ])],
      // "isverified" : ['true',Validators.compose([
      //   Validators.minLength(4)
      // ])],
    });
    // this.changePasswordForm = fb.group({
    //     oldpassword : ['', Validators.compose([
    //       Validators.required,
    //       Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')
    //     ])],
    //     newpassword : ['', Validators.compose([
    //       Validators.required,
    //       Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')
    //     ])],
    //     confirmnewpassword : ['', Validators.compose([
    //       Validators.required,
    //       Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')
    //     ])]
    //   });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('newpassword').value === formGroup.get('confirmnewpassword').value
      ? null : { 'mismatch': true };
  }

  // changePassword(){
  //     console.log('22312312423423');
  //     this.changePass = true;
  // }

  // onChangePasswordSubmit(){
  //   this.passwordFail = false;
  //   this.passwordMatchFail = false
  //   this.oldpassword = this.changePasswordForm.value.oldpassword;
  //   this.newpassword = this.changePasswordForm.value.newpassword;
  //   this.confirmnewpassword = this.changePasswordForm.value.confirmnewpassword;
  //   this.changePasswordData = this.changePasswordForm.value;
  //   if(!this.changePasswordForm.valid){
  //       this.passwordFail = true;
  //       setTimeout(() => {
  //         this.passwordFail = false;
  //       },4000);
  //   }
  //   else if(this.newpassword != this.confirmnewpassword){
  //       this.passwordMatchFail = true;
  //       setTimeout(() => {
  //           this.passwordMatchFail = false;
  //       },4000);
  //   }
  //   else{
  //       console.log(this.changePasswordData);
  //       this.authService.changePassword(this.changePasswordData).subscribe(
  //           res => {
  //               document.getElementById('changepassword-modal').click();
  //               this.toasterService.showSuccess(res['message'], 'Success');
  //               console.log(res,' =-=-=-=--=');
  //               this.changePasswordForm.reset();
  //               this.router.navigate(['/profile']);
  //           },
  //           err => {
  //               this.toasterService.showError(err.error.message, 'Error');
  //           }
  //       );
  //   }
  // }

  myprofile() {
    this.authService.getMyProfile().subscribe(
        res => {
        this.oneuser = res['data'];
        console.log(this.oneuser);
        this.editUserForm.patchValue(this.oneuser);
        },
        err => {
        this.toasterService.showError(err.error.message,'Error');
        console.log(err);
        }
    );
  }

  selectFile(event: any) {
        // console.log(event,'111111');
        this.imageFile = <File>event.target.files[0];
        console.log(this.imageFile,'aaaaaa');
        // this.     = this.fileName.name;
        // console.log(this.fileNameData,'oo');
    }

    // updateUserName(userName) {
    //     this.authService.updateUserName(userName);
    // }

    editUserSubmit(){
        this.editProfileFail = false;
        if(!this.editUserForm.valid){
            this.editProfileFail = true;
            setTimeout(() => {
            this.editProfileFail = false;
            },8000);
        }
        else{
            // const fdd = new FormData();
            // fdd.append('name', this.imageUploadForm.value.name);
            // fdd.append('image', this.fileName, this.fileName.name);

            // let name = (this.imageFile.name).replace(/\s/g,'');
            // const fileName = Math.random()*21312534165+''+name;
            // s3.putObject({
            //     Bucket: "",
            //     Key: fileName,
            //     ACL: 'public-read',
            //     Body: this.imageFile,
            //     ContentLength: this.imageFile.size,
            //     ContentType: this.imageFile.type,
            // },
            // (err, data)=>{
            //     if(err){
            //         console.log(`error: "Error while uploading image." ${err}`);   
            //     }
            //     else{
            //         let imageUrl =`https://.s3.amazonaws.com/${fileName}`;
            //         console.log(imageUrl,"url from aws");
            //     }
            // });

            this.editUserData = this.editUserForm.value;
            this.authService.editUser(this.editUserData).subscribe(
                (res)=>{
                    this.toasterService.showSuccess(res.message,'Success');
                   /// this.updateUserName(res['data']['firstname']);
                    this.editUserForm.reset();
                    // this.myprofile();
                    this.router.navigate(['/users/profile']);
                },
                (err) =>{
                    this.toasterService.showError(err.error.message,'Error');
                    console.log(err.error,'errrrrrr');
                }
            );
        }

    }
  
  ngOnInit() {
    //this.myprofile();
    
    this.authService.getId().subscribe(res => {
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
     };
        this.editUserForm.patchValue(res);
    })
    
 }

}

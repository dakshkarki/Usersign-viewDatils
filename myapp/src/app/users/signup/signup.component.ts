import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3000/api/users/signin';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  signupSuccessful = false;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  roles = [{ 'id': 1, 'name': 'Artist' }, { 'id': 2, 'name': 'User' }];



  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = fb.group({
      'firstname': ['', [
        Validators.required,
        Validators.pattern('^([a-zA-Z]*)$'),
      ]],
      'lastname': ['', [
        Validators.required,
        Validators.pattern('^([a-zA-Z]*)$'),
      ]],
      'email': ['', [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9.]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$')
      ]],
      // 'role': ['', Validators.required],
      'password': ['', Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')
      ])],
      'cpassword': ['', [
        Validators.required,
      ]],
      "gender" : ['',Validators.compose([
        // Validators.minLength(4),
         Validators.required,
    ])],
    "state" : ['',Validators.compose([
      // Validators.minLength(4),
       Validators.required,
  ])],
  "city" : ['',Validators.compose([
    // Validators.minLength(4),
     Validators.required,
])],
    "mobilenumber" : ['',Validators.compose([
      Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
      // Validators.minLength(4),
      // Validators.required,
  ])],
    }, { validator: this.passwordMatchValidator });

  }
  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password').value === formGroup.get('cpassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user = {
        'firstname': this.signupForm.value.firstname,
        'lastname': this.signupForm.value.lastname,
        'email': this.signupForm.value.email,
        'password': this.signupForm.value.password,
        // 'role': this.signupForm.value.role,
        'gender':this.signupForm.value.gender,
        'state':this.signupForm.value.gender,
        'city':this.signupForm.value.gender,
        'mobilenumber':this.signupForm.value.mobilenumber,
      };
      this.authService.signUp(user).subscribe(datax => {
      console.log(datax, 'RESPONE FROM SERVER');
      this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
           console.log('ImageUpload:uploaded:', item, status, response);
           alert('File uploaded successfully');
       };
      this.signupSuccessful = true;
      this.signupForm.reset();
      });
    }
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-listprofile',
  templateUrl: './listprofile.component.html',
  styleUrls: ['./listprofile.component.css']
})
export class ListprofileComponent implements OnInit {
  _id :any;
  profileuser: any;
  constructor(private jwtService : JwtService,
    private authService : AuthService,
    private router: Router,
    private toasterService : ToasterService,) { }
    
    
    // allprofile() {
    //   this.authService.findAllUser().subscribe(
    //   res => {
    //     this.profileuser = res['data'];
    //     console.log(this.profileuser);
    //   },
    //   err => {
    //     this.toasterService.showError(err.error.message,'Error');
    //     console.log(err);
    //   }
    // );
    // }
  
    DeleteData(_id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        //console.log(result);
        if (result.value) {
          //console.log(result.value);
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          this.authService.deleteUser(_id).subscribe(res=> {
       
            if (res.userResponse.message == "success") {
              this.toasterService.showSuccess(res.message,'Profile Delete Sucessfully');
              this.profileuser  = res.userResponse.userData;
            }
            else {
                alert(res.userResponse.message);
            }
        });
        }
      })
     
    
  }
  
  editData(_id){
    this.authService.sendId(_id);
    this.router.navigate(['/users/editprofile']);
  }
  ngOnInit() {

    this.authService.findAllUser().subscribe(
      res => {
        console.log(res);
        this.profileuser = res.userResponse.userData;
        console.log(this.profileuser);
      },
      err => {
        this.toasterService.showError(err.error.message,'Error');
        console.log(err);
      }
    );
  }

}

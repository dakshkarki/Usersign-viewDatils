import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {
  title = 'Stripe-ng Payment';
  newpay : Number;
  public allDone = false;
  pay : any = [
    {money:200, value:20000},
    {money:300, value:30000},
    {money:400, value:40000}
  ];
  constructor(private jwtService : JwtService,
    private authService : AuthService,
    private router: Router,) { }

  ngOnInit() {
  }
  openCheckout(event) {
    this.newpay = event.target.value;
    var user=this;
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_bxZaJ1GbgkJdTVuNh7vWcird00ff0FbvkP', // your pk test key from stripe 
      locale: 'auto',
      token: function (token: any) {
        console.log(token);
        user.authService.confirmPayment(token).subscribe(
          res=>{
            console.log(res);
            user.allDone = true;
          },
          err=>{
            console.log(err);
          }
        )
      }
    });

    handler.open({
      name: 'GSP Production Payment',
      description: 'Test Stripe',
      amount: this.newpay,
      currency: 'usd'
    });

  }

}

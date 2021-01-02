import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy{
private authStatusSubs: Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getAuthListener().subscribe(
      authStatus => {

      }
    );
  }
  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    else{
      this.authService.createUser(form.value.name, form.value.email, form.value.password);
    }
    form.resetForm();
  }
  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }
}

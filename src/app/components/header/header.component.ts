import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
  this.authListenerSubs =  this.authService.getAuthListener().subscribe(isAthenticated => {
      this.userIsAuthenticated = isAthenticated;
    });
  }
  onLogout(){
    this.authService.logOut();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

}

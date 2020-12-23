import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './auth.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false
  private token: string;
  tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient , private router: Router) { }
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthListener(){
    return this.authStatusListener.asObservable();
  }
  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logOut()
    }, duration * 1000)
  }
  createUser(name: string, email: string, password: string){
    const authData : User = {name: name, email: email, password: password};
    this.http.post('http://localhost:3000/signup', authData)
    .subscribe(res =>{
      console.log(res);
    })
    
  }
  logIn(email: string, password: string){
    const authData : User = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/login', authData)
    .subscribe(res =>{
      const token = res.token;
      this.token = token;
      if(token){
        const expiresInDuration = res.expiresIn
        this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
     this.saveAuthData(token, expirationDate);
      this.router.navigate(['/']);
      }
    })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true)
    }
  }

  logOut(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

}

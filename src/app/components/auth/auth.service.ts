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
  private userId: string;
  tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient , private router: Router) { }
  getToken(){
    return this.token;
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserId(){
    return this.userId;
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
    })
    this.router.navigate(['/']);
  }
  logIn(email: string, password: string){
    const authData : User = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/login', authData)
    .subscribe(res =>{
      const token = res.token;
      this.token = token;
      if(token){
        const expiresInDuration = res.expiresIn
        this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = res.userId;
      this.authStatusListener.next(true);
      const now = new Date();
     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(token, expirationDate, this.userId);
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
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true)
    }
  }

  logOut(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}

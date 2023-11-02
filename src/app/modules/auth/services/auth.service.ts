// import { Injectable, OnDestroy } from '@angular/core';
// import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
// import { map, catchError, switchMap, finalize } from 'rxjs/operators';
// import { UserModel } from '../models/user.model';
// import { AuthModel } from '../models/auth.model';
// import { AuthHTTPService } from './auth-http';
// import { environment } from 'src/environments/environment';
// import { Router } from '@angular/router';

// export type UserType = UserModel | undefined;

// @Injectable({
//     providedIn: 'root',
// })
// export class AuthService implements OnDestroy {
//     // private fields
//     private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
//     private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

//     // public fields
//     currentUser$: Observable<UserType>;
//     isLoading$: Observable<boolean>;
//     currentUserSubject: BehaviorSubject<UserType>;
//     isLoadingSubject: BehaviorSubject<boolean>;

//     get currentUserValue(): UserType {
//         return this.currentUserSubject.value;
//     }

//     set currentUserValue(user: UserType) {
//         this.currentUserSubject.next(user);
//     }

//     constructor(
//         private authHttpService: AuthHTTPService,
//         private router: Router,
//     ) {
//         this.isLoadingSubject = new BehaviorSubject<boolean>(false);
//         this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
//         this.currentUser$ = this.currentUserSubject.asObservable();
//         this.isLoading$ = this.isLoadingSubject.asObservable();
//         const subscr = this.getUserByToken().subscribe();
//         this.unsubscribe.push(subscr);
//     }

//     logout() {
//         localStorage.removeItem(this.authLocalStorageToken);
//         this.msalService.logoutRedirect();
//     }

//     getUserByToken(): Observable<UserType> {
//         const auth = this.getAuthFromLocalStorage();
//         if (!auth || !auth.authToken) {
//             return of(undefined);
//         }

//         this.isLoadingSubject.next(true);
//         return this.authHttpService.getUserByToken(auth.authToken).pipe(
//             map((user: UserType) => {
//                 if (user) {
//                     this.currentUserSubject.next(user);
//                 } else {
//                     this.logout();
//                 }
//                 return user;
//             }),
//             finalize(() => this.isLoadingSubject.next(false))
//         );
//     }

//     // private methods
//     private setAuthFromLocalStorage(auth: AuthModel): boolean {
//         // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
//         if (auth && auth.authToken) {
//             localStorage.setItem(
//                 this.authLocalStorageToken,
//                 JSON.stringify(auth)
//             );
//             return true;
//         }
//         return false;
//     }

//     public getAuthFromLocalStorage(): AuthModel | undefined {
//         try {
//             const lsValue = localStorage.getItem(this.authLocalStorageToken);

//             if (!lsValue) {
//                 return undefined;
//             }

//             const authData = JSON.parse(JSON.stringify(lsValue));
//             return authData;
//         } catch (error) {
//             console.error(error);
//             return undefined;
//         }
//     }

//     getAuthTokenFromLocalStorage(): string | undefined {
//         const value = localStorage.getItem(this.authLocalStorageToken);

//         if (!value) {
//             return undefined;
//         }

//         return value;
//     }

//     async checkAndSetActiveAccount() {
//         let activeAccount = this.msalService.instance.getActiveAccount();

//         if (
//             !activeAccount &&
//             this.msalService.instance.getAllAccounts().length > 0
//         ) {
//             let accounts = this.msalService.instance.getAllAccounts();
//             this.msalService.instance.setActiveAccount(accounts[0]);
//             await this.getAzureToken();
//         } else {
//             var userInfo = this.getCurrentUserLocalStorage();
//             this.currentUserSubject.next(userInfo);
//         }
//     }

//     public getCurrentUserLocalStorage(): UserModel | undefined {
//         try {
//             const lsValue = localStorage.getItem(this.authLocalStorageToken);

//             if (!lsValue) {
//                 return undefined;
//             }

//             const authData = JSON.parse(JSON.stringify(lsValue));
//             return authData;
//         } catch (error) {
//             console.error(error);
//             return undefined;
//         }
//     }

//     checkActiveAccount() {
//         let activeAccount = this.msalService.instance.getActiveAccount();

//         if (
//             activeAccount &&
//             this.msalService.instance.getAllAccounts().length > 0
//         ) {
//             return true;
//         }

//         return false;
//     }

//     async getAzureToken() {
//         let self = this;
//         const requestObj = {
//             scopes: [environment.adScopes],
//         };

//         var response: any = await this.msalService
//             .acquireTokenSilent(requestObj)
//             .toPromise();
//         this.setLocalStorage(response.accessToken, '');
//         this.getUserInfo(response);
//     }

//     getUserInfo(azureResponse: any) {
//         var azureUserName = azureResponse.account.username;
//     }

//     setLocalStorage(token: any, user: any) {
//         var userInfo = new UserModel();
//         userInfo.authToken = token;

//         this.currentUserSubject.next(userInfo);
//         localStorage.setItem(
//             `${environment.appVersion}-${environment.USERDATA_KEY}`,
//             token
//         );
//     }

//     ngOnDestroy() {
//         this.unsubscribe.forEach((sb) => sb.unsubscribe());
//     }
// }

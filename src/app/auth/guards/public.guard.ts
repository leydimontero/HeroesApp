
import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, GuardResult, MaybeAsync, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {
   constructor(
      private authService: AuthService,
      private router: Router
    ) { }

  private checkAutStatus(): boolean | Observable<boolean> {

     return this.authService.checkAuthentication()
     .pipe(
       tap( isAuthenticated => console.log( 'Authenticated' , isAuthenticated )),
       tap( isAuthenticated => {
         if ( isAuthenticated ) {
           this.router.navigate(['./']);
         }
       }),
       map( isAuthenticated => !isAuthenticated )
     )
   }


   canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
     // console.log('CanMatch');
     // console.log({ route, segments});
     return this.checkAutStatus();
   }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
     // console.log('CanActivate');
     // console.log({ route, state});
     return this.checkAutStatus();
   }
  }

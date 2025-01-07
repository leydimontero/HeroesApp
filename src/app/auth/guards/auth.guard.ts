import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{
  constructor() { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    console.log({ route, state});

    throw new Error('Method not implemented.');
  }
  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    console.log({ route, segments});

    throw new Error('Method not implemented.');
  }

}

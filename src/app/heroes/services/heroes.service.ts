import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Hero } from '../interfaces/hero.interface';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }




    getHeroes():Observable<Hero[]> {
      return this.httpClient.get<Hero[]>(`${ this.baseUrl }/heroes`);
    }

    getHeroById( id: string ): Observable<Hero|undefined>{
      return this.httpClient.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error  => of(undefined) )
      );
    }
}

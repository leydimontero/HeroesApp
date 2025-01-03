import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService: HeroesService,
    private activedRouter: ActivatedRoute,
    private router: Router
   ){}

  ngOnInit(): void {

    // Verifica si la URL es la de creación de un nuevo héroe
  if (this.router.url.includes('new-hero')) {
    // Inicializa el formulario para un nuevo héroe
    this.heroForm.reset({
      superhero: '',
      alter_ego: '',
      first_appearance: '',
      characters: '',
      publisher: null,
      alt_img: ''
    });
    return; // Salir de la función
  }

  // Lógica para editar un héroe existente
  this.activedRouter.params
    .pipe(
      switchMap(({ id }) => this.heroesService.getHeroById(id)),
    )
    .subscribe(hero => {
      if (!hero) {
        console.error('Héroe no encontrado, redirigiendo...');
        this.router.navigateByUrl('/');
        return; // Asegúrate de que haya un return aquí
      }
      this.heroForm.reset(hero);
      return; // Agrega un return aquí también (opcional)
    });
    // if ( this.router.url.includes('edit')) return;

    // this.activedRouter.params
    // .pipe(
    //   switchMap( ({ id }) => this.heroesService.getHeroById( id )),
    // ).subscribe( hero => {

    //   if ( !hero ) {
    //     console.error('Héroe no encontrado, redirigiendo...');
    //     return this.router.navigateByUrl('/');
    //   }
    //   this.heroForm.reset( hero );
    //   return;
    // })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;

  }

  onSubmit(): void {
    if( this.heroForm.invalid ) return;
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
      .subscribe( hero => {
        //.TODO:.mostrar.snackbar
      });

      return;
    }
    this.heroesService.addHero( this.currentHero )
    .subscribe( hero => {
      // TODO: mostrar snackbar, y navegar a /heroes/edit/hero.id
    })

  }

}

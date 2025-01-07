import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';

import { ComfirDialogComponent } from '../../components/comfir-dialog/comfir-dialog.component';



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
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
   ){}

  ngOnInit(): void {

  if (this.router.url.includes('new-hero')) {

    this.heroForm.reset({
      superhero: '',
      alter_ego: '',
      first_appearance: '',
      characters: '',
      publisher: null,
      alt_img: ''
    });
    return;
  }

  this.activedRouter.params
    .pipe(
      switchMap(({ id }) => this.heroesService.getHeroById(id)),
    )
    .subscribe(hero => {
      if (!hero) {
        console.error('Héroe no encontrado, redirigiendo...');
        this.router.navigateByUrl('/');
        return;
      }
      this.heroForm.reset(hero);
      return;
    });

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
        this.router.navigate( ['/heroes/edit', hero.id ]);
        this.showSnackbar(`${ hero.superhero } Udpated!`);
      });

      return;
    }
    this.heroesService.addHero( this.currentHero )
    .subscribe( hero => {
      this.showSnackbar(`${ hero.superhero } Created!`)

    })

  }

  onDeletoHero() {
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ComfirDialogComponent, {
      data: this.heroForm.value
    });

     dialogRef.afterClosed()
     .pipe(
      filter( (result:boolean) => result ),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
      filter( (wasDeleted:boolean) => wasDeleted ),
     )
     .subscribe(result => {
      this.router.navigate(['/heroes'])
     })

    }

  showSnackbar( message: string ): void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

}

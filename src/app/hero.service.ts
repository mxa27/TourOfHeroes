import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

	getHeroes(): Observable<Hero[]> {
		//send message
		this.messageService.add('HeroService: полуичть список hero');
		return of(HEROES);
	}

	getHero(id: number): Observable<Hero> {
		this.messageService.add(`HeroService: выбрать hero id=${id}`);
		return of(HEROES.find(hero => hero.id === id));
	}

  constructor(private messageService: MessageService) { }
}

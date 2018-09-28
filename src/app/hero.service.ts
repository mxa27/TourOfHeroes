import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

	private heroesUrl = 'api/heroes'; //URL to web api

	getHeroes(): Observable<Hero[]> {
		//Получение из mock
		// this.messageService.add('HeroService: полуичть список hero');
		// return of(HEROES);

		//Получение из http
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				//Сообщает об ошибке и возвращает безобидный результат
				catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		this.messageService.add(`HeroService: выбрать hero id=${id}`);
		return of(HEROES.find(hero => hero.id === id));
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} ошибка: ${error.message}`);
			return of(result as T);
		};
	}

  constructor(
		private messageService: MessageService,
		private http: HttpClient) { }

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

}

import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
				tap(heroes => this.log('скачали героев')),
				catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number): Observable<Hero> {
		// this.messageService.add(`HeroService: выбрать hero id=${id}`);
		// return of(HEROES.find(hero => hero.id === id));
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`получение героя по id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} ошибка: ${error.message}`);
			return of(result as T);
		};
	}

	updateHero (hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`обновлен hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	addHero (hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
			tap((hero: Hero) => this.log(`Добавлен новый hero w/ id=@{hero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	deleteHero (hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, httpOptions).pipe(
			tap(_ => this.log(`удален hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	searchHeroes(term: string): Observable<Hero[]> {
		if(!term.trim) {
			return of([]);
		}

		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(_ => this.log(`поиск heroes по совпадению "${term}`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
	}

  constructor(
		private messageService: MessageService,
		private http: HttpClient) { }

	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

}

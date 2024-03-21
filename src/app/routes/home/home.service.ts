import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Activity } from '../../domain/activity.type';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //# crea un privete http

  #http = inject(HttpClient);
  #url = 'http://localhost:3000/activities'
  constructor() { }

  getActivities$(): Observable<Activity[]>{
    return this.#http.get<Activity[]>(this.#url).pipe(
      catchError((error) => {
        console.log(error);
        return of([]);
      }));
  }
}

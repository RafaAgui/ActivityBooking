import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACTIVITIES } from '../domain/activities.data';
import { Activity } from '../domain/activity.type';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
  <article>
    <header>
      <h2>Activities</h2>
    </header>
    <main>
    @for(activity of activities(); track activity.id){
      <p>
        <span>
          <a [routerLink]="['/', 'bookings', activity.slug]" r >{{activity.name}}</a>
        </span>
          {{activity.location}}
      </p>
    }
    </main>
  </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomePage {
  activities: WritableSignal<Activity[]> = signal([]);
  #http = inject(HttpClient);

  constructor(){
    this.#http.get<Activity[]>('http://localhost:3000/activities').subscribe((result) => {
      this.activities.set(result);
      console.log('activities', this.activities);
  });
    console.log('constructor finished');
  }
}

import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
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
        @for (activity of activities(); track activity.id) {
          <p>
            <span>
              <a [routerLink]="['/', 'bookings', activity.slug]"> {{ activity.name }}</a>
            </span>
            <span>at {{ activity.location }} </span>
          </p>
        }
      </main>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #title = inject(Title);
  #meta = inject(Meta);
  #http = inject(HttpClient);

  // activities: WritableSignal<Activity[]> = signal([]);

    // Qué hace el toSignal() ??
  // 1 - subscribe
  // 2 - signal.set
  // 3 - unsubscribe
  // 4 - signal read-only no mutable


  activities: Signal<Activity[]> = toSignal(
    this.#http.get<Activity[]>('http://localhost:3000/activities').pipe(
      catchError((error)=>{
        console.log(error);
        return of([]);
      })
    ),
    { initialValue: [] },

  )

  constructor() {
    this.#title.setTitle('🏡 - Home');
    this.#meta.updateTag({ name: 'description', content: 'Home page' });

  //   this.#http
  //     .get<Activity[]>('http://localhost:3000/activities')
  //     .subscribe((result: Activity[]) => this.activities.set(result));
  }
}

import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Activity, NULL_ACTIVITY } from '../../domain/activity.type';
import { Booking, NULL_BOOKING } from '../../domain/booking.type';
import { BookingConfirmComponent } from './booking-confirm.component';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, FormsModule, BookingConfirmComponent],
  template: `
    <article>
      @if (activity(); as activity) {
        <header>
          <h2>{{ activity.name }}</h2>
          <p [class]="activity.status">
            <span>{{ activity.location }} </span>
            <span>{{ activity.price | currency: 'EUR' }}</span>
            <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
            <span>{{ activity.status | uppercase }}</span>
          </p>
        </header>
      }
      <main>
        <p>
          Current participants: <b>{{ currentParticipants() }}</b>
        </p>
        <form>
          <label for="newParticipants"
            >New participants:
            <span>
              @for (participant of participants(); track participant.id) {
                <span>🏃‍♂️ {{ participant.id }}</span>
              } @empty {
                <span>🕸️</span>
              }
            </span>
          </label>
          <input
            name="newParticipants"
            type="number"
            min="0"
            [max]="maxNewParticipants()"
            [ngModel]="newParticipants()"
            (ngModelChange)="onNewParticipantsChange($event)"
          />
        </form>
        <div>
          Total participants: <b>{{ totalParticipants() }}</b>
        </div>
      </main>
      <footer>
        <lab-booking-confirm [canBook]="canBook()" (saveBooking)="onSaveBooking()" />
      </footer>
    </article>
  `,
  styles: `
    .draft {
      color: violet;
      font-style: italic;
    }
    .published {
      color: limegreen;
    }
    .confirmed {
      color: green;
    }
    .sold-out {
      color: green;
      font-style: italic;
    }
    .done {
      color: orange;
      font-style: italic;
    }
    .cancelled {
      color: red;
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookingsPage {

  #title = inject(Title);
  #meta = inject(Meta);
  #service = inject(BookingsService);

  currentParticipants: WritableSignal<number> = signal<number>(3);
  participants: WritableSignal<{ id: number }[]> = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
  newParticipants: WritableSignal<number> = signal(0);

  totalParticipants: Signal<number> = computed(
    () => this.currentParticipants() + this.newParticipants(),
  );
  maxNewParticipants = computed(() => this.activity().maxParticipants - this.currentParticipants());
  isSoldOut = computed(() => this.totalParticipants() >= this.activity().maxParticipants);
  canBook = computed(() => this.newParticipants() > 0);

  /** The slug of the activity that comes from the router */
  slug: InputSignal<string> = input.required<string>();

  #slug$: Observable<string> = toObservable(this.slug);

  #activity$: Observable<Activity> = this.#slug$.pipe(
    switchMap((slug: string) => {
      return this.#service.getActivitiesbySlug$(slug);
    }),
  );

  activity: Signal<Activity> = toSignal(this.#activity$, { initialValue: NULL_ACTIVITY });


  constructor() {
    effect(() => {
      const activity = this.activity();
      this.#title.setTitle(activity.name);
      const description = `${activity.name} in ${activity.location} on ${activity.date} for ${activity.price}`;
      this.#meta.updateTag({ name: 'description', content: description });
    });
    effect(() => {
      if (this.isSoldOut()) {
        console.log('Se ha vendido todo');
      } else {
        console.log('Hay entradas disponibles');
      }
    });
  }

  onNewParticipantsChange(newParticipants: number) {
    /** Setting the newParticipants value */
    this.newParticipants.set(newParticipants);
    /** Updating the participants array */
    this.participants.update((participants) => {
      const updatedParticipants = participants.slice(0, this.currentParticipants());
      for (let i = 1; i <= newParticipants; i++) {
        updatedParticipants.push({ id: updatedParticipants.length + 1 });
      }
      return updatedParticipants;
    });
  }

  onSaveBooking() {
    const newBooking: Booking = NULL_BOOKING;
    newBooking.activityId = this.activity().id;
    newBooking.participants = this.newParticipants();
    if (newBooking.payment)
      newBooking.payment.amount = this.activity().price * this.newParticipants();

    this.#service.postBooking$(newBooking).subscribe({
      next: () => {
        this.putActivityStatus();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  putActivityStatus() {
    const updatedActivity = this.activity();
    updatedActivity.status = 'confirmed';
    this.#service.putActivityStatus$(updatedActivity).subscribe({
        next: () => {
          this.currentParticipants.set(this.totalParticipants());
          this.newParticipants.set(0);
        },
      });
  }
}
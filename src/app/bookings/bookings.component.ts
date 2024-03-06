import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity } from '../domain/activity.type';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, FormsModule],

  template: `
    <article>
      <header>
        <h2>{{ activity.name }}</h2>
        <p [class]="activity.status">
          <span>{{ activity.location }} {{ activity.price | currency }}</span>
          <span>{{ activity.date | date : 'dd-MMM-yyyy' }}</span>
          <span>{{ activity.status | uppercase }}</span>
        </p>
      </header>
      <main>
        <p>Current participants: {{ currentParticipants() }}</p>
        <input type="number" [ngModel]="newParticipants()" (ngModelChange)="onNewParticipantsChange($event)" />
        <p>Total participants: {{ totalParticipant() }}</p>
        <div>
          @for (participant of participants(); track participant.id) {
            <span>🏃‍♂️ {{ participant.id }}</span>
          }
        </div>
      </main>
      <footer>
        @if(canBook()){
        <button class="primary" (click)="onBookingClick()">Book now</button>
        } @else{
          <p>Book your place</p>
        }
      </footer>
    </article>
  `,
  styles:
  `
  .draft {
    color: violet;
    font-style: italic;
  }
  .published {
    color: darkgreen;
  }
  .confirmed {
    color: green;
  }
  .sold-out {
    color: limegreen;
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
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingsComponent {
  activity: Activity = {
    name: 'Paddle surf',
    location: 'Lake Leman at Lausanne',
    price: 100,
    date: new Date(2025, 7, 15),
    minParticipants: 4,
    maxParticipants: 10,
    status: 'published',
    id: 1,
    slug: 'paddle-surf',
    duration: 2,
    userId: 1,
  };

  // currentParticipants: number = 3;
  // newParticipants: number = 1;

  //lo paso a señal
  participants: WritableSignal<{ id: number }[]> = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
  currentParticipants: Signal<number> = signal(3);
  newParticipants: WritableSignal<number> = signal(1);
  totalParticipant = computed(
    () =>  this.currentParticipants() + this.newParticipants());

  onNewParticipantsChange(newParticipants: number) {
    this.newParticipants.set(newParticipants);
    this.participants.update((participants) => {
      participants = participants.slice(0, this.currentParticipants());
      for (let i = 1; i <= newParticipants; i++) {
        participants.push({ id: this.currentParticipants() + i });
      }
      return participants;
    });
  }

  canBook= computed(() => this.newParticipants() > 1);

  constructor(){
    effect(() =>{
      console.log('News participant', this.newParticipants())
    })
  }

  onBookingClick(){
    console.log('Booking participant', this.totalParticipant())
  }
}

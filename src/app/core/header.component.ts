import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
  <header>

    <nav>
      <a [routerLink]="['/']" ><h1>{{title}}</h1></a>
      <a [routerLink]="['/', 'bookings']" >bookings </a>
      <a [routerLink]="['/', 'auth', 'login']" >Login </a>
      <a [routerLink]="['/', 'auth', 'register']" >Register </a>
    </nav>
  </header>
  `,
  styles: `
  nav {
    justify-content: flex-start;
    align-items: baseline;
  }
  a {
    padding-inline: 1rem;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  title = 'Activity Bookings';
}

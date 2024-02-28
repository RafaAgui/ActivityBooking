import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <h1>{{title}}</h1>
  `,
  styles: ` `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  title = 'Activity Bookings';
}

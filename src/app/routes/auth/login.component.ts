import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <h2>
      Login
    </h2>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {

}

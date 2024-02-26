import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Bienvenido a {{title}}!</h1>
    <p>Toma ya! he creado un proyecto en Angular moderno </p>
    <router-outlet />
  `,
  styles: []
})
export class AppComponent {
  title = 'Trololo';
}

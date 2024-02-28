import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <a [href]="author.homepage" target="_blank">By {{ author.name }}.</a>
        <div>{{ getYear() }}</div>
        <button class="secondary outline" (click)="onAcceptCookies()">Accept cookies</button>
      </nav>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  author = {
    name: 'Softtek',
    homepage: 'https://www.softtek.com/es-es/'
  }

  // year = new Date().getFullYear();

  //puedo usar un método
  getYear(){
    return new Date().getFullYear();
  }

  onAcceptCookies(){
    console.log('Cookies Acceptes')
  }

}

import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <a [href]="author.homepage" target="_blank">By {{ author.name }}.</a>
        <div>{{ year }}</div>
        @if(!cookiesAccepted()){
          <button class="secondary outline" (click)="onAcceptCookies()">Accept cookies</button>
        } @else {
          <p>Cookies Accepted</p>
        }
      </nav>

      <div>
      <button [hidden]="cookiesAccepted()" class="secondary outline" (click)="onAcceptCookies()">Accept cookies</button>
      <p [hidden]="cookiesPending()">Cookies Accepted</p>
      </div>
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

  year = new Date().getFullYear();


  cookiesAccepted: WritableSignal<boolean> = signal(false)
  cookiesPending: Signal<boolean> = computed(() => {return !this.cookiesAccepted()})

  onAcceptCookies(){
    this.cookiesAccepted.update((valor: boolean) => {
      return !valor;
    });
  }

}

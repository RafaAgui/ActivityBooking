import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <div>by Softtek <span> 2024</span></div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `

    <header>
      <h1>Angular + D3</h1>
    </header>
    <app-bar></app-bar>
    <app-pie></app-pie>
    <app-scatter></app-scatter>

  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-vizualization-angular-d3';
}

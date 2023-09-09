import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid d-flex justify-content-center">
        <a class="nav-link active" href="#">Angular + D3</a>
      </div>
    </nav>
    <main class="container">
      <div class="row">
        <div class="col-md-6">
          <app-bar></app-bar>
        </div>
        <div class="col-md-6">
          <app-pie></app-pie>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <app-scatter></app-scatter>
        </div>
      </div>
    </main>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-vizualization-angular-d3';
}

import { Component, OnInit } from '@angular/core';
import { NbaService } from './services/nba/nba.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main class="container p-4">
      <div class="row">
        <div class="col-md-12 card">
          <horizontal-bar-chart
            *ngIf="topTenOfSeasonPlayers.length > 0"
            [data]="topTenOfSeasonPlayers"
            [year]="currentYear"
            (change)="changeYear($event)">
          </horizontal-bar-chart>
        </div>
        <!-- <div class="col-md-4 card">
          <app-pie></app-pie>
        </div> -->
      </div>
      <div class="row mt-2">
        <div class="col-md-5 card">
          <donut-chart
            *ngIf="seassonPlayers.length > 0"
            [data]="seassonPlayers">
          </donut-chart>
        </div>
        <div class="col-md-7 card">
          <app-bar
            *ngIf="seassonPlayers.length > 0"
            [data]="seassonPlayers">
          </app-bar>
        </div>
      </div>
    </main>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NBA Season | Dashboard';
  seassonPlayers: any[] = [];
  currentYear = new Date().getFullYear();
  topTenOfSeasonPlayers: any[] = [];

  constructor(private nbaService: NbaService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.allPlayersSeason(this.currentYear)
  }

  allPlayersSeason(year: number) {

    this.nbaService.allPlayersBySeason(year).subscribe(response => {
      this.seassonPlayers = response.results;
      if(this.seassonPlayers.length > 0) {
        this.topTenOfSeasonPlayers = this.seassonPlayers.slice(0,10)
      }
    })
  }

  changeYear(newYear: number){
    this.seassonPlayers = []
    this.topTenOfSeasonPlayers = []
    this.currentYear = newYear;
    this.allPlayersSeason(newYear);
  }

}

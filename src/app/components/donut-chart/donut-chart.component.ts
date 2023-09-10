import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'donut-chart',
  template: `
    <div class="row p-2 m2">
      <div class="col-md-10">
        <h4> Individual summary </h4>
      </div>
      <div class="col-md-2 d-flex justify-content-end">
        <select [(ngModel)]="selectedPlayerId" (change)="onPlayerSelect()">
          <option *ngFor="let player of data" [value]="player.id">{{ player.player_name }} <small>( {{ player.team }} )</small></option>
        </select>
      </div>
    </div>
    <figure id="cDonut" class="d-flex justify-content-center mt-2"></figure>

  `,
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit{

  @Input() data: Array<any> = new Array<any>(10);

  private width = 400;
  private height = Math.min(this.width, 400);
  private radius = Math.min(this.width, this.height) / 2;
  private svg: any;
  private arc:any;
  private pie: any;
  private color: any;
  selectedPlayerId: any
  private playerDetails: any = {
    data: []
  };

  constructor() {

    this.arc = d3.arc()
      .innerRadius(this.radius * 0.67)
      .outerRadius(this.radius - 1);

    this.pie = d3.pie()
      .padAngle(1 / this.radius)
      .sort(null)
      .value((d: any) => d.value);

    this.color = d3.scaleOrdinal()
      .domain(this.data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

  }
  ngOnInit(): void {
    this.makeDetail(this.data[0])
    this.createSvg();
    this.drawPie();
  }
  private createSvg() {
    this.svg = d3.select("figure#cDonut")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto;");
  }
  private drawPie(): void {
    this.svg.append("g")
    .selectAll()
    .data(this.pie(this.playerDetails.data))
    .join("path")
      .attr("fill", (d: any) => this.color(d.data.name))
      .attr("d", this.arc)
    .append("title")
      .text((d: any) => `${d.data.name}: ${d.data.value}`);

      this.svg.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
        .selectAll()
        .data(this.pie(this.playerDetails.data))
        .join("text")
          .attr("transform", (d: any) => `translate(${this.arc.centroid(d)})`)
          .call((text: any) => text.append("tspan")
              .attr("y", "-0.4em")
              .attr("font-weight", "bold")
              .text((d: any) => d.data.name))
          .call((text: any) => text.filter((d: any) => (d.endAngle - d.startAngle) > 0.25).append("tspan")
              .attr("x", 0)
              .attr("y", "0.7em")
              .attr("fill-opacity", 0.7)
              .text((d: any) => d.data.value));
  }

  makeDetail(player: any) {

  this.selectedPlayerId = player.id;

  const dPlayer = this.data.filter(p => p.id === player.id)[0];

  this.playerDetails.data = [
      { name: 'PF', value: dPlayer.PF },
      { name: 'FTA', value: dPlayer.fta },
      { name: 'Points', value: dPlayer.PTS },
      { name: 'FP', value: dPlayer.field_percent },
      { name: 'Games', value: dPlayer.games },
      { name: 'GS', value: dPlayer.games_started },
      { name: 'Minutes Played', value: dPlayer.minutes_played },
      { name: 'Season', value: dPlayer.season }
    ];
  }

  onPlayerSelect(){
    this.svg.selectAll("*").remove();
    const player = this.data.filter(p => p.id === Number(this.selectedPlayerId))[0];
    this.makeDetail(player);
    this.drawPie();
  }

}

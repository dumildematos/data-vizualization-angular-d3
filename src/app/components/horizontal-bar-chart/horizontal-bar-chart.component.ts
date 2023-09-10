import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'horizontal-bar-chart',
  template: `
    <div class="row p-2 m2">
      <div class="col-md-10">
        <h3> Top 10 players with the best performance on the court {{ year }} </h3>
      </div>
      <div class="col-md-2 d-flex justify-content-end">
        <select [(ngModel)]="selectedYear" (change)="onYearSelect()">
          <option *ngFor="let year of years" [value]="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <figure id="hbar"></figure>
  `
})
export class HorizontalBarChartComponent implements OnInit, OnChanges{

  @Input() data: Array<any> = new Array<any>(10);
  @Input() year: number = new Date().getFullYear();
  @Output() change: EventEmitter<any> = new EventEmitter();

  private svg: any;

  private barHeight = 25;
  private marginTop = 30;
  private marginBottom = 10;
  private marginLeft = 30;

  private width = 928;
  private height = Math.ceil((this.data.length + 0.1) * this.barHeight) + this.marginTop + this.marginBottom;

  selectedYear: number;
  years: number[] = [];

  constructor() {
    this.selectedYear = this.year;
    for (let i = 0; i < 10; i++) {
      this.years.push(this.selectedYear - i);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedYear = this.year;
  }


   ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);

  }

  private createSvg(): void {

    this.svg = d3.select("figure#hbar")
      .append("svg")
      .attr("width", "100%")
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])


    // Implement the zoom behavior
    // const zoom = d3
    //   .zoom()
    //   .scaleExtent([1, 10]) // Set the zoom level limits
    //   .on('zoom', (event: any) => {
    //      const newTransform = event.transform;
    //     this.svg.attr('transform', newTransform);
    //   });

    // this.svg.call(zoom);
  }


  zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
    const newTransform = event.transform;
    this.svg.attr('transform', newTransform);
  }

  private drawBars(data: any[]): void {

    //

    // Create the scales.
    const x: any = d3.scaleLinear()
        .domain([0, d3.max(data, (d:any) => d.field_percent)])
        .range([this.marginLeft, this.width]);

    const y: any = d3.scaleBand()
        .domain(d3.sort(data, (d:any) => -d.field_percent).map(d => d.player_name))
        .rangeRound([this.marginTop, this.height - this.marginBottom])
        .padding(0.1);

    // Create a value format.
    const format = x.tickFormat(50, "%");

    // this.svg.remove();

    // Append a rect for each letter.
    this.svg.append("g")
          .attr("fill", "steelblue")
        .selectAll()
        .data(data)
        .join("rect")
          .attr("x", x(0))
          .attr("y", (d:any) => y(d.player_name))
          .attr("width", (d:any) => x(d.field_percent) - x(0))
          .attr("height", y.bandwidth());


    this.svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
    .selectAll()
    .data(data)
    .join("text")
      .attr("x", (d: any) => x(d.field_percent))
      .attr("y", (d: any) => y(d.player_name) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("dx", -4)
      .text((d: any) => format(d.field_percent))
    .call((text: any) => text.filter((d: any) => x(d.field_percent) - x(0) < 20) // short bars
      .attr("dx", +4)
      .attr("fill", "black")
      .attr("text-anchor", "start"));

    // Create the axes.
    this.svg.append("g")
        .attr("transform", `translate(0,${this.marginTop})`)
        .call(d3.axisTop(x).ticks(this.width / 80, "%"))
        .call((g:any) => g.select(".domain").remove())

    this.svg.append("g")
        .attr("transform", `translate(${this.marginLeft},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0));

  }

  onYearSelect() {
    this.svg.selectAll("*").remove();
    this.change.emit(Number(this.selectedYear));
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


declare var techan:any;
declare var d3:any;


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  
})


export class ModalComponent implements OnInit {
    
  @Input() data!: {mode:any,data:any,symbol:any}
  @Input() modal!: ModalController

  public historyData:Array<string>|null = null;
  public mode:string = '';
  public path:string = "/AJAX/csv?symbol=";


  constructor() { }

  ngOnInit() {

    switch (this.data["mode"]){

      case 'history':
        this.historyData  = Object.keys(this.data['data']);
        this.mode="history";
        break;

      case 'chart':
        this.getChart(this.data['symbol']);
        this.mode="chart";
        break;
    }
    
  }

  close(){
    this.modal.dismiss()
  }

  getChart(symbol:string){

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1130 - margin.left - margin.right,
    height = 780 - margin.top - margin.bottom;

    var parseDate = d3.timeParse("%d-%b-%y");

    var x = techan.scale.financetime()
            .range([0, width]);

    var y = d3.scaleLinear()
            .range([height, 0]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var xAxis = d3.axisBottom()
            .scale(x);

    var yAxis = d3.axisLeft()
            .scale(y);

    var svg = d3.select("#chart").append("svg")

            .attr("width", "100%") // keine feste Höhe + Breite für das SVG
            .attr("height", "100%") // responsive
            .attr('preserveAspectRatio', 'none')
            .attr("viewBox", "0 0 1130 780") // = margin-left, margin-bottom, width, height (wie auf Handy)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    symbol = symbol.trim();
    
    let path = this.path.concat(symbol);

    d3.csv(path, function(error:any, data:any) {
        var accessor = candlestick.accessor();
        console.log(data, 'data');
        data = data.slice(0, 200).map(function(d:any) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a:any, b:any) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        svg.append("g")
                .attr("class", "candlestick");

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

        svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

        // Data to display initially
        draw(data.slice(0, data.length-20));

        // Only want this button to be active if the data has loaded
        // Button style stört navbar button, besser #chart button ansprechen
    //  d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
    });

    function draw(data:any) {
        x.domain(data.map(candlestick.accessor().d));
        y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

        svg.selectAll("g.candlestick").datum(data).call(candlestick);
        svg.selectAll("g.x.axis").call(xAxis);
        svg.selectAll("g.y.axis").call(yAxis);
    }
}

}

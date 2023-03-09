import {Component, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import { CSV_PATH } from 'src/environments/environment';

const d3 = require('../../../assets/d3.js');
const techan = require('../../../assets/techan.js');


@Component({
    selector: 'app-modal', 
    templateUrl: 'modal.component.html', 
    styleUrls: ['modal.component.scss']
})


export class ModalComponent implements OnInit {

    @Input()data !: {
        mode: string,
        data: any,
        symbol: string,
        name: string
    }

    public historyData : HistoryData[]
    public mode : string = '';
    public path : string = CSV_PATH;


    constructor(private modal : ModalController) {}

    ngOnInit() {

        switch (this.data["mode"]) {

            case 'history':
                this.historyData = this.data.data
                this.mode = "history";
                break;

            case 'chart':
                this.getChart(this.data['symbol']);
                this.mode = "chart";
                break;

            case 'swiper':
                this.mode = "swiper"
                break;

            default:
        }
    }

    close() {
        this.modal.dismiss()
    }

    getChart(symbol : string) {

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = 1130 - margin.left - margin.right,
            height = 780 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%d-%b-%y");

        var x = techan.scale.financetime().range([0, width]);

        var y = d3.scaleLinear().range([height, 0]);

        var candlestick = techan.plot.candlestick().xScale(x).yScale(y);

        var xAxis = d3.axisBottom().scale(x);

        var yAxis = d3.axisLeft().scale(y);

        var svg = d3.select("#chart")
        
            .append("svg")
            .attr("width", "100%") // keine feste Höhe + Breite für das SVG
            .attr("height", "100%") // responsive
            .attr('preserveAspectRatio', 'none')
            .attr("viewBox", "0 0 1130 780") // = margin-left, margin-bottom, width, height (wie auf Handy)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        symbol = symbol.trim();
        let path = CSV_PATH.concat(symbol);

        d3.csv(path, function (error: any, data: Array<any>) {
            var accessor = candlestick.accessor();
            data = data.map(function (d: any) {
                return {
                    date: parseDate(d.Date),
                    open: + d.Open,
                    high: + d.High,
                    low: + d.Low,
                    close: + d.Close,
                    volume: + d.Volume
                };
            }).sort(function (a: any, b: any) {
                return d3.ascending(accessor.d(a), accessor.d(b));
            });
           
            svg.append("g").attr("class", "candlestick");

            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");

            svg.append("g").attr("class", "y axis").append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");

            // Data to display initially
            draw(data.slice(0, data.length - 20));

            // Only want this button to be active if the data has loaded
            // Button style stört navbar button, besser #chart button ansprechen
            // d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
        });

        function draw(data: any) {
            x.domain(data.map(candlestick.accessor().d));
            y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

            svg.selectAll("g.candlestick").datum(data).call(candlestick);
            svg.selectAll("g.x.axis").call(xAxis);
            svg.selectAll("g.y.axis").call(yAxis);
        }
    }

    getDate(unixdate: number){

        // Convert 7-digit timestamp
        if(String(unixdate).length === 7){
            unixdate = Number(String(unixdate) + '000')
        }
        
        const date = new Date();
        return date.toLocaleDateString();
    }
}

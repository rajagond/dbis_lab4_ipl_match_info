import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexFill,
  ApexPlotOptions,
  ApexYAxis,
  ApexTooltip,
  ApexLegend
} from "ng-apexcharts";
import { PlayerInfoService } from '../services/player-info.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;

};

export type ChartOptions_b = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};


@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.css']
})
export class PlayerInfoComponent implements OnInit {

  @ViewChild("chart", { static: false })
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptions_b: Partial<ChartOptions_b> | any;

  player_id!: string;
  playerBasic: any;
  playerBat = {
    'num_matches': 0,
    'total_score': 0,
    'fours': 0,
    'sixes': 0,
    'num_out': 0,
    'balls_faced': 0,
    'strike_rate': '0',
    'average': '0',
    'high_score': 0,
    'fifties': 0
  };
  playerBowl = {
    'num_matches': 0,
    'runs': 0,
    'wickets': 0,
    'balls': 0,
    'fives': 0,
    'overs': 0,
    'eco': '0'
  }


  constructor(private route: ActivatedRoute, private service: PlayerInfoService) { }

  ngOnInit(): void {

    if (this.route.snapshot.paramMap.get('player_id'))
      this.player_id = this.route.snapshot.paramMap.get('player_id') as string;

    this.service.getData(this.player_id).subscribe((data: any) => {
      this.playerBasic = data[0];
    });

    this.service.getData(this.player_id + '/batgraphinfo').subscribe((data: any) => {
      let match_ids = [];
      let runs_scored = [];
      for (let i in data) {
        match_ids.push(data[i].match_id);
        runs_scored.push(parseInt(data[i].match_score));
      }

      this.chartOptions = {
        series: [
          {
            name: "Runs Scored",
            data: runs_scored
          },

        ],
        chart: {
          type: "bar",
          height: 350
        },
        title: {
          text: "Matchwise Past Batting Performance"
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"

          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: match_ids,
          title: {
            text: "Match ID"
          }
        },
        yaxis: {
          title: {
            text: "Runs"
          }
        },
        fill: {
          opacity: 1,
          colors: [function ({ value, seriesIndex, w }: { value: any, seriesIndex: any, w: any }) {
            if (value < 30) {
              return '#7E36AF'
            } else if (value <= 50) {
              return '#D9534F'
            } else {
              return '#546E7A'
            }
          }
          ]
        },

        legend: {
          /*
           * @param {string} seriesName - The name of the series corresponding to the legend
           * @param {object} opts - Contains additional information as below
           * opts: {
           *   seriesIndex
           *   w: {
           *     config,
           *     globals  
           *   },
           * }
          */
          showForSingleSeries: true,
          customLegendItems: ['<30', '>=30 and <=50', '>50'],
          markers: { fillColors: ['#7E36AF', '#D9534F', '#546E7A'] }
        }

      };

    });



    this.service.getData(this.player_id + '/batdetails').subscribe((data: any) => {
      this.playerBat.num_matches = parseInt(data.num_matches[0].num_matches);
      if (this.playerBat.num_matches > 0) {
        this.playerBat.total_score = parseInt(data.other_details[0].total_score);
        this.playerBat.fours = parseInt(data.other_details[0].fours);
        this.playerBat.sixes = parseInt(data.other_details[0].sixes);
        this.playerBat.balls_faced = parseInt(data.other_details[0].balls_faced);
        this.playerBat.num_out = parseInt(data.other_details[0].num_out);
        this.playerBat.high_score = parseInt(data.high_fifties[0].high_score);

        this.playerBat.fifties = parseInt(data.high_fifties[0].num_fifties);
        if (this.playerBat.balls_faced > 0) {
          this.playerBat.strike_rate = ((this.playerBat.total_score / this.playerBat.balls_faced) * 100).toPrecision(3)
        }
        if (this.playerBat.num_out > 0) {
          this.playerBat.average = ((this.playerBat.total_score / this.playerBat.num_out)).toPrecision(3);
        }
      }
    });

    this.service.getData(this.player_id + '/bowldetails').subscribe((data: any) => {
      this.playerBowl.num_matches = parseInt(data.num_matches[0].num_matches);
      if (this.playerBowl.num_matches > 0) {
        this.playerBowl.runs = parseInt(data.other_details[0].runs_conceded);
        this.playerBowl.wickets = parseInt(data.other_details[0].wickets);
        this.playerBowl.balls = parseInt(data.other_details[0].balls_bowled);
        this.playerBowl.fives = parseInt(data.fives_overs_bowled[0].num_fives);
        this.playerBowl.overs = parseInt(data.fives_overs_bowled[0].over_bowled);
        if (this.playerBowl.overs > 0)
          this.playerBowl.eco = (this.playerBowl.runs / this.playerBowl.overs).toPrecision(3);
      }

    });

    this.service.getData(this.player_id + '/bowlgraphinfo').subscribe((data: any) => {
      let wic_data = [];
      let runs_data = [];
      let match_ids = [];

      for (let i in data) {
        wic_data.push(data[i].wickets);
        match_ids.push(data[i].match_id);
        runs_data.push(data[i].runs_conceded);
      }

      this.chartOptions_b = {
        series: [
          {
            name: "Runs",
            type: "column",
            data: runs_data
          },
          {
            name: "Wickets",
            type: "line",
            data: wic_data
          }
        ],
        chart: {
          height: 350,
          type: "line"
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: "Matchwise Past Bowling Performance"
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: match_ids,
        xaxis: {
          title: {
            text: "Match ID"
          }
        },
        yaxis: [
          {
            title: {
              text: "Runs"
            }
          },
          {
            opposite: true,
            title: {
              text: "Wickets"
            }
          }
        ]
      };

    });
  }

}

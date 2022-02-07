import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatchDetailsService } from '../services/match-details.service';
import { BatterInfo } from '../interfaces/match-info';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations,
  ApexMarkers,
  ApexTheme,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  theme: ApexTheme;
  fill: ApexFill;
};

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {
  @ViewChild("chart", { static: false })
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public pchartOptions1: Partial<PieChartOptions> | any;
  public pchartOptions2: Partial<PieChartOptions> | any;


  displayedColumns1 = ['Batter', 'Runs', 'fours', 'sixes', 'ball_faced'];
  displayedColumns2 = ['extras', 'totals'];
  displayedColumns3 = ['Bowler', 'balls_bowled', 'runs_given', 'wickets'];
  displayedColumns4 = ['Details'];
  displayedColumns7 = ['batsman', 'runs', 'bowler', 'wickets'];
  displayedColumns5 = ['Playing_eleven_team1', 'Playing_eleven_team2'];

  dataSource1 = new MatTableDataSource<BatterInfo>([]);
  dataSource2 = new MatTableDataSource<BatterInfo>([]);
  dataSource3 = new MatTableDataSource<any>([]);
  dataSource4 = new MatTableDataSource<BatterInfo>([]);
  dataSource5 = new MatTableDataSource<BatterInfo>([]);
  dataSource6 = new MatTableDataSource<any>([]);
  dataSource7 = new MatTableDataSource<any>([]);
  dataSource8 = new MatTableDataSource<any>([]);
  dataSource9 = new MatTableDataSource<any>([]);
  data_Inn1_Summ = new MatTableDataSource<any>([]);
  data_Inn2_Summ = new MatTableDataSource<any>([]);
  data_SummBase: any;
  link!: string | null;
  Team: any;
  displayedColumns6!: string[];

  constructor(private route: ActivatedRoute, private service: MatchDetailsService) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('match_id'))
      this.link = this.route.snapshot.paramMap.get('match_id');

    this.service.getInningTeamData(this.link + '/team').subscribe((data: any) => {
      this.Team = data[0];
    });

    this.service.getInningTeamData('cumulative_run/' + this.link + '/1').subscribe((data1: any) => {
      let data_mark: {
        seriesIndex: number; dataPointIndex: number; size: number; fillColor: string; strokeColor: string; shape: string; // "circle" | "square" | "rect"
      }[] = [];

      for (let i in data1) {
        if (data1[i].wicket_over > 0) {
          data_mark.push(
            {
              seriesIndex: 0,
              dataPointIndex: (data1[i].over_id - 1),
              size: 7.5,
              fillColor: '#27AE60',
              strokeColor: '#fff',
              shape: "square"
            }
          )
        }
      }

      this.service.getInningTeamData('cumulative_run/' + this.link + '/2').subscribe((data2: any) => {

        for (let i in data2) {
          if (data2[i].wicket_over > 0) {
            data_mark.push(
              {
                seriesIndex: 1,
                dataPointIndex: (data2[i].over_id - 1),
                size: 7.5,
                fillColor: '#D68910',
                strokeColor: '#fff',
                shape: "square"
              }
            )
          }
        }


        this.chartOptions = {
          series: [
            {
              name: this.Team.inn1_team,
              data: data1.map((ele: { cum_run: any; }) => ele.cum_run),
              color: '#9B59B6'
            },
            {
              name: this.Team.inn2_team,
              data: data2.map((ele: { cum_run: any; }) => ele.cum_run),
              color: '#2E4053'
            }
          ],
          chart: {
            height: 350,
            type: "line",
            zoom: {
              enabled: false
            },
            animations: {
              enabled: true
            }
          },
          stroke: {
            curve: "straight"
          },
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          title: {
            text: "Score Comparison"
          },
          markers: {
            discrete: data_mark,
            size: 1
          }
        };
      });
    });


    this.service.getInnData('pie/' + this.link + '/1').subscribe((data: any) => {
      let tmp = [data[0]?.extras, data[0]?.ones, data[0]?.twos, data[0]?.threes, data[0]?.fours, data[0]?.sixs];
      let numdata = tmp.map(x => parseInt(x));
      this.pchartOptions1 = {
        series: numdata,
        chart: {
          width: 500,
          type: "pie"
        },
        labels: ["Extras", "Ones", "Twos", "Threes", "Fours", "Sixes"],
        title: {
          text: `${this.Team.inn1_team}\'s Score Distribution`
        },

        dataLabels: {
          formatter: function (val: any, opts: any) {
            return opts.w.config.series[opts.seriesIndex]
          }
        },

        theme: {
          monochrome: {
            enabled: true,
            color: '#3c0008',
            shadeTo: 'light',
            shadeIntensity: 0.65
          }
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };

    });


    this.service.getInnData('pie/' + this.link + '/2').subscribe((data: any) => {
      let tmp = [data[0]?.extras, data[0]?.ones, data[0]?.twos, data[0]?.threes, data[0]?.fours, data[0]?.sixs];
      let numdata = tmp.map(x => parseInt(x));
      this.pchartOptions2 = {
        series: numdata,
        chart: {
          width: 500,
          type: "pie"
        },

        theme: {
          monochrome: {
            enabled: true,
            color: '#152238',
            shadeTo: 'light',
            shadeIntensity: 0.65
          }
        },
        labels: ["Extras", "Ones", "Twos", "Threes", "Fours", "Sixes"],
        title: {
          text: `${this.Team.inn2_team}\'s Score Distribution`
        },

        dataLabels: {
          formatter: function (val: any, opts: any) {
            return opts.w.config.series[opts.seriesIndex]
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };

    });
    this.service.getInnData(this.link + '/1').subscribe((data: any) => {
      this.data_Inn1_Summ.data = data;
    });

    this.service.getInnData(this.link + '/2').subscribe((data: any) => {
      this.data_Inn2_Summ.data = data;
    });

    this.service.getInnData('basic_details/' + this.link).subscribe((data: any) => {
      this.data_SummBase = data[0];
    });
    this.service.getData(this.link + '/1').subscribe((data: any) => {
      this.dataSource1.data = data.batsman;
      this.dataSource2.data = data.extra;
      this.dataSource3.data = data.bowler;
    });
    this.service.getData(this.link + '/2').subscribe((data: any) => {
      this.dataSource4.data = data.batsman;
      this.dataSource5.data = data.extra;
      this.dataSource6.data = data.bowler;
    });
    this.service.getData(this.link + '').subscribe((data: any) => {
      this.dataSource7.data = data.basic_details;
      this.dataSource8.data = data.umpire;
      const sr = "XI "
      this.displayedColumns6 = [sr.concat(data.basic_details[0].team1.toString()), sr.concat(data.basic_details[0].team2.toString())]
      this.dataSource9.data = data.playing_eleven;
    });
  }

}


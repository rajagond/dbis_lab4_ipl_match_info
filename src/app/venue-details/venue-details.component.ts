import { Component, ViewChild, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartDataset, ChartEvent, ChartType } from 'chart.js';
import { VenueDetails, Venueline, Venuepie } from '../interfaces/venues';
import { VenueDetailsService } from '../services/venue-details.service';

@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css']
})
export class VenueDetailsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  venue_id!: string;
  dataSourcex!: VenueDetails[];
  num_mat : number = 0;
  public pieChartData!: ChartDataset[];
  public pieChartType: ChartType = 'doughnut';
  public pieLabel: string[] = ['Team Batting 1st won', 'Team Batting 2nd won', 'Draw'];
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        enabled: false
      },
      title: {
        display: true,
        text: 'Winning Stats at Venue',
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        labels: {
          value: {
            color: 'white'
          },
        },
        formatter: (value, ctx) => {
          let dataArr = ctx.chart.data.datasets[0].data;
          const add = (a: any, b: any) => parseInt(a) + parseInt(b)
          const sum = dataArr.reduce(add);
          let percentage = (value * 100 / (sum as number)).toFixed(2) + "%";
          return percentage;
        },
      },
    },
  };
  public pieChartPlugins = [DatalabelsPlugin];
  public lineChartType: ChartType = 'line';
  public lineChartData!: ChartDataset[];
  public lineLabel!: string[];
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        },
      },
      y:
      {
        position: 'left',
        title: {
          display: true,
          text: 'Runs'
        },
        ticks: {
          padding: 20,
        },
      },
    },

    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Average First Innings Score'
      }
    }
  };

  constructor(private activatedRoute: ActivatedRoute, private getService: VenueDetailsService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('venue_id')) this.venue_id = params.get('venue_id') as string;
    });
    this.getTableFromService();
  }

  private getTableFromService() {
    this.getService.getBasicDetails(this.venue_id).subscribe((data: VenueDetails[]) => {
      this.dataSourcex = data;
      this.num_mat = this.dataSourcex[0].num_matches;
      this.getService.getGraphDetails(this.venue_id).subscribe((data2: Venuepie[]) => {
        this.pieChartData = [
          {
            data: Object.values(data2[0]),
            label: 'venue',
            borderWidth: 1,
            backgroundColor: ['#884EA0', '#1F618D', '#F1C40F']
          }];
      });
      this.getService.getLineGraphDetails(this.venue_id).subscribe((data: Venueline[]) => {
        const data2: number[] = []
        const label: string[] = []
        data.forEach(element =>
          data2.push(element['avg']));

        data.forEach(element =>
          label.push(element['season_year']));
        this.lineChartData = [
          {
            fill: false,
            data: data2,
            label: this.dataSourcex[0]?.venue_name,
          }];
        this.lineLabel = label
      })
    });
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }


}

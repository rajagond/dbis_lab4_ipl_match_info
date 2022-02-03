import { Component, ViewChild, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartData, ChartDataset, ChartType } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { VenueDetails, Venuepie } from '../interfaces/venues';
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
  // Pie

  public pieChartData!: ChartDataset[];
  public pieChartType: ChartType = 'pie';
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
          let percentage = (value*100 / (sum as number)).toFixed(2)+"%";
          return percentage;
      },
      },
    },
  };
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(private activatedRoute: ActivatedRoute, private getService: VenueDetailsService) { 
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if(params.get('venue_id')) this.venue_id = params.get('venue_id') as string ;
    });
    this.getTableFromService();
    this.getGraphFromService();
  }

  private getTableFromService(){
    this.getService.getBasicDetails(this.venue_id).subscribe((data: VenueDetails[])=>{
      this.dataSourcex = data
    }) 
  }

  private getGraphFromService(){
    this.getService.getGraphDetails(this.venue_id).subscribe((data2: Venuepie[])=>{
      this.pieChartData = [
        {
        data: Object.values(data2[0]),
        label: 'venue',
        borderWidth: 1,
        backgroundColor: ['#884EA0', '#1F618D', '#F1C40F' ]
       }];
       console.log(this.pieChartData);
       console.log(data2);
    }) 
  }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }



}

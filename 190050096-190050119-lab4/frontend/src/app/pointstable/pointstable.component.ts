import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Pointstable } from '../interfaces/pointstable';
import { PointstableService } from '../services/pointstable.service';

@Component({
  selector: 'app-pointstable',
  templateUrl: './pointstable.component.html',
  styleUrls: ['./pointstable.component.css']
})
export class PointstableComponent implements OnInit {
  year!: string;
  dataSource = new MatTableDataSource<Pointstable>([]);

  columns = [
    {
      columnDef: 'Team Name',
      header: 'Team Name',
      cell: (element: Pointstable) => `${element.team_name}`,
    },
    {
      columnDef: 'Mat',
      header: 'Mat',
      cell: (element: Pointstable) => `${element.mat}`,
    },
    {
      columnDef: 'Won',
      header: 'Won',
      cell: (element: Pointstable) => `${element.won}`,
    },
    {
      columnDef: 'Lost',
      header: 'Lost',
      cell: (element: Pointstable) => `${element.loss}`,
    },
    {
      columnDef: 'Tied',
      header: 'Tied',
      cell: (element: Pointstable) => `${element.tied}`,
    },
    {
      columnDef: 'NR',
      header: 'NR',
      cell: (element: Pointstable) => `${element.nrr}`,
    },
    {
      columnDef: 'pts',
      header: 'pts',
      cell: (element: Pointstable) => `${element.pts}`,
    },
  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(private activatedRoute: ActivatedRoute, private getService: PointstableService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('year')) this.year = params.get('year') as string;
    });
    this.getTableFromService();
  }

  private getTableFromService() {
    this.getService.getPointstable(this.year).subscribe((data: Pointstable[]) => {
      this.dataSource.data = data;
    })
  }
}

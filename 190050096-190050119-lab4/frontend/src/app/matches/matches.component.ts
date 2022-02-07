import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatchInfo } from '../interfaces/match-info';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatchesinfoService } from '../services/matchesinfo.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit, AfterViewInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource = new MatTableDataSource<MatchInfo>([]);
  displayedColumns = ['IPL_season', 'Match_Details', 'Results'];

  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  constructor(private infoService: MatchesinfoService) {
  }

  ngOnInit(): void {
    this.infoService.getData().subscribe((data: MatchInfo[]) => {
      this.dataSource.data = data;
      this.length = data.length
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}

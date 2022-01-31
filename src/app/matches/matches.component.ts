import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatchInfo } from '../interfaces/match-info';
import { MatchesinfoService } from '../matchesinfo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit, AfterViewInit {
  products: any[] = [];
  //skip: number = 0;
  //limit: number = 10;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource = new MatTableDataSource<MatchInfo>([]);
  displayedColumns = [ 'IPL_season', 'Match_Details', 'Results'];

  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  constructor(private infoService: MatchesinfoService) {

   }

  ngOnInit(): void {
    //this.infoService.getData(this.skip, this.limit).subscribe((data: MatchInfo[])=>{
    this.infoService.getData().subscribe((data: MatchInfo[])=>{
      console.log(data);
      
      this.products = data;
      this.dataSource.data = data;
      this.length = data.length
      console.log(this.length);
    }) 
  }
  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
  }

  // MatPaginator Output
  // MatPaginator Output
  //pageEvent: PageEvent = new PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}

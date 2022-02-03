import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Venues } from '../interfaces/venues';
import { VenuesService } from '../services/venues.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {

  dataSource = new MatTableDataSource<Venues>([]);

  displayedColumns = ['Venue', 'Address']
  constructor( private getService: VenuesService) { }

  ngOnInit(): void {
    this.getTableFromService();
  }

  private getTableFromService(){
    this.getService.getVenues().subscribe((data: Venues[])=>{
      console.log(data);
      this.dataSource.data = data;
      console.log(this.dataSource.data);
      console.log(this.displayedColumns);
    }) 
  }

}

import { Component, OnInit } from '@angular/core';
import { MatchInfo } from '../interfaces/match-info';
import { MatchesinfoService } from '../matchesinfo.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  products: any[] = [];
  usersJson: any[] = [];
  skip: number = 0;
  limit: number = 10;

  constructor(private infoService: MatchesinfoService) {

   }

  ngOnInit(): void {
    this.infoService.getData(this.skip, this.limit).subscribe((data: MatchInfo[])=>{
      console.log(data);
      
      this.products = data;
      this.usersJson = Array.of(this.products);
      console.log(this.products);
    }) 
  }

  next(){
    this.skip = this.skip + 1;
    this.infoService.getData(this.skip, this.limit).subscribe((data: MatchInfo[])=>{
      console.log(data);
      
      this.products = data;
      this.usersJson = Array.of(this.products);
      console.log(this.products);
    }) 
  }

}

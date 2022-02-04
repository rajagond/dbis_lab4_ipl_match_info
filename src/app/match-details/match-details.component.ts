import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatchDetailsService } from '../services/match-details.service';
import { BatterInfo } from '../interfaces/match-info';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {
  displayedColumns1 = [ 'Batter', 'Runs', 'fours', 'sixes', 'ball_faced'];
  displayedColumns2 = [ 'extras', 'totals'];
  displayedColumns3 = [ 'Bowler', 'balls_bowled', 'runs_given', 'wickets'];
  displayedColumns4 = [ 'Details']

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
  link!: string | null;
  Team: any ;
  displayedColumns6!: string[];

  constructor(private route:ActivatedRoute, private service: MatchDetailsService ) { 
  }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('match_id'))
      this.link = this.route.snapshot.paramMap.get('match_id');

    this.service.getInningTeamData(this.link + '/team').subscribe((data: any)=>{
      console.log(data);
      this.Team = data[0]
      console.log(this.Team)
    });

    this.service.getData(this.link + '/1').subscribe((data: any)=>{
      console.log(data.batsman);
      this.dataSource1.data = data.batsman;
      this.dataSource2.data = data.extra;
      this.dataSource3.data = data.bowler;
    });
    this.service.getData(this.link + '/2').subscribe((data: any)=>{
      console.log(data.batsman);
      this.dataSource4.data = data.batsman;
      this.dataSource5.data = data.extra;
      this.dataSource6.data = data.bowler;
    });
    this.service.getData(this.link + '').subscribe((data: any)=>{
      this.dataSource7.data = data.basic_details;
      this.dataSource8.data = data.umpire;
      const sr = "XI "
      this.displayedColumns6 = [sr.concat(data.basic_details[0].team1.toString()), sr.concat(data.basic_details[0].team2.toString())]
      this.dataSource9.data = data.playing_eleven;
      console.log(this.dataSource9);
    });
  }

}

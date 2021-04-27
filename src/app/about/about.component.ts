import { LeaderService } from './../service/leader.service';
import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders!:Leader[];

  constructor( private leaderservice:LeaderService) { }

  ngOnInit(): void {
    this.leaders = this.leaderservice.getLeaders();
  }

}
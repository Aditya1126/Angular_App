import { Leaders } from './../shared/leaders';
import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  getLeaders(): Leader[] {
    return Leaders;
  }

  getLeader(id: string):Leader {
    return Leaders.filter((leader) => (leader.id === id))[0];
  }

  getFeaturedLeader(): Leader {
    return Leaders.filter((leader) => leader.featured)[0];
  }

  constructor() { }
}

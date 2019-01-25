import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.scss']
})
export class BeerComponent implements OnInit {

  testData: any[] = [
    {
      'name': 'Lukas',
      'quantity': 10
    }, {
      'name': 'Patrick',
      'quantity': -10
    }, {
      'name': 'Dennis',
      'quantity': 100
    }, {
      'name': 'Niek',
      'quantity': -18
    }, {
      'name': 'Rhea',
      'quantity': -91
    }, {
      'name': 'Maartje',
      'quantity': 1
    }, {
      'name': 'Nicky',
      'quantity': 23
    }, {
      'name': 'Luuk',
      'quantity': 11
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}

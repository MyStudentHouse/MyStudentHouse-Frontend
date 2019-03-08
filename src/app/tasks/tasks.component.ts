import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  showOverviewTasks: boolean = false;

  testTasks: any[] = [];

  constructor() { }

  ngOnInit() {
    this.testTasks.push(1);
    this.testTasks.push(2);
    this.testTasks.push(3);
    console.log(this.testTasks);
    console.log(this.testTasks[0]);
  }

  toggleShowOverviewTasks() {
    this.showOverviewTasks = !this.showOverviewTasks;
  }

}

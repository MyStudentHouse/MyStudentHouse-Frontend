import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  readonly apiUrl = environment.apiUrl;

  showOverviewTasks: boolean = false;

  testTasks: any[] = [];

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.testTasks.push(1);
    this.testTasks.push(2);
    this.testTasks.push(3);
    console.log(this.testTasks);
    console.log(this.testTasks[0]);

    this.getContainerTurn();
  }

  toggleShowOverviewTasks() {
    this.showOverviewTasks = !this.showOverviewTasks;
  }

  getContainerTurn() {
    this.http.post<any>(`${this.apiUrl}/container?user_id=${this.authenticationService.userData.id}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

}

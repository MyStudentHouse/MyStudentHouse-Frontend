import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  readonly apiUrl = environment.apiUrl;

  showOverviewTasks: boolean = false;

  tasks: any[] = [];

  userTasks: any[] = [];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getTasksForHouse();
    this.getTasksForUser();
  }

  /**
   * Toggles the show all tasks overview.
   */
  toggleShowOverviewTasks() {
    this.showOverviewTasks = !this.showOverviewTasks;
  }

  /**
   * Gets the tasks for the authenticated user.
   * 
   * @param {int} weeks - The number of weeks to show. 
   */
  getTasksForUser(weeks = 3) {
    this.http.get<any>(`${this.apiUrl}/task/user/${this.authenticationService.userData.id}/3`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.userTasks = res['success'];
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Getting all user tasks failed.', `${error.statusText}`);
      }
    )
  }

  /**
   * Gets all tasks for a specific house with the schedule of a particular task
   */
  getTasksForHouse() {
    this.http.get<any>(`${this.apiUrl}/task/house/${this.authenticationService.houseData.id}`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.tasks = res['success'];
        this.tasks.forEach(async element => {
          element['schedule'] = await this.getTaskAssignees(element.id, 10);
        });
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Getting all tasks for the house failed.', `${error.statusText}`);
      }
    )
  }

  /**
   * Get's the assigned people to a task in an async way.
   * 
   * @param {int} id - The task id.
   * @param {int} weeks - The number of weeks to show. 
   */
  async getTaskAssignees(id, weeks = 10) {
    return this.http.get<any>(`${this.apiUrl}/task/${id}/${weeks}`, this.authenticationService.httpOptions).toPromise();
  }

  // Playground //

  addTask() {
    this.http.post<any>(`${this.apiUrl}/task?name=Lukas&description=Kat buitenzetten2&house_id=2&interval=7&start_datetime=2020/05/01 07:00:00&reminder=1&mark_complete=0`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    )
  }

  assignUserToTask() {
    this.http.post<any>(`${this.apiUrl}/task/user/assign?task_id=7&user_email=mystudenthouse@lukasant.nl`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    )
  }

}

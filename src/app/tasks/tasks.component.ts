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

  newTask = {
    taskName: "",
    description: "",
    interval: 1,
    startDateTime: undefined
  }

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
   * Adds a new task.
   */
  addTask() {
    this.http.post<any>(
      `${this.apiUrl}/task?name=${this.newTask.taskName}&description=${this.newTask.description}&house_id=${this.authenticationService.houseData.id}&interval=${this.newTask.interval}&start_datetime=${this.newTask.startDateTime}&reminder=1&mark_complete=0`,
      {},
      this.authenticationService.httpOptions).subscribe(
        (res) => {
          this.newTask.taskName = '';
          this.newTask.description = '';
          this.ngOnInit();
        },
        error => {
          this.notificationService.addNotification('alert-danger', `Adding ${this.newTask.taskName} failed, please try again.`, `${error.statusText}`);
          console.log(error);
        }
      )
  }

  /**
   * Assigns the current user to the task.
   * 
   * @param {int} taskId - The task id.
   */
  assignMyself(taskId) {
    this.assignUserToTask(taskId, this.authenticationService.userData.email)
  }

  /**
   * Assign user to task.
   * 
   * @param {int} taskId - The task id.
   * @param {string} userEmail - The email address of the user.
   */
  assignUserToTask(taskId, userEmail) {
    this.http.post<any>(`${this.apiUrl}/task/user/assign?task_id=${taskId}&user_email=${userEmail}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.ngOnInit();
      },
      error => {
        console.log(error);
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

}

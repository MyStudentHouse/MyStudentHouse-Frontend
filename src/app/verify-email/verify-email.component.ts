import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    const expires = this.route.snapshot.paramMap.get("expires");
    const signature = this.route.snapshot.paramMap.get("signature");
    console.log(`${id}, ${expires}, ${signature}`);
    this.verifyEmail(id, expires, signature);
  }

  verifyEmail(id, expires, signature) {
    this.http.get<any>(`${this.apiUrl}/verify/${id}?expires=${expires}&signature=${signature}`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

}

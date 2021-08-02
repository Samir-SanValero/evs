import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication/authentication.service';
import { User } from './services/authentication/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'evs';

  // Sets initial value to true to show loading spinner on first load
  loading = true;
  user: User;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(userData => this.user = userData);

    this.authenticationService.user.subscribe((userData) => {
      this.user = userData;
    });
  }

  logout(): void {
    this.authenticationService.logout();
  }

}

export const roundNumberToInteger = function(n: number): number {
    return Math.round(n);
};


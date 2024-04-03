import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FerreControl (FC)';

  constructor(private authService: AuthenticationService) {}

  get userOn(): boolean {
    return this.authService.usuarioAutenticado;
  }
}

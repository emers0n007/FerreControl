import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FerreControl (FC)';
  showAlert = false;
  okay: boolean = false;
  mesage = '';
  shakeAlert: boolean = false;
  navbarVisible: boolean = true;

  constructor(private authService: AuthenticationService, private alertService: AlertService) {}

  get userOn(): boolean {
    return this.authService.usuarioAutenticado;
  }

  toggleNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }


  ngOnInit(): void {
    this.alertService.alert$.subscribe((res: any) => {
      console.log(res);
      this.mesage = res.message;
      this.okay = res.okay;
      this.showAlert = true;
      this.triggerShake();
      setTimeout(() => {this.showAlert = false}, res.time);
    });
  }

  triggerShake() {
    this.shakeAlert = true;
    setTimeout(() => {
      this.shakeAlert = false;
    }, 300);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { LoginService } from 'app/services/login/login.service';
import { UserProfile } from 'app/Enums/user-profile.enum';
import { UserStatut } from 'app/Enums/UserStatut.enum';
declare var toastr: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userProfile: typeof UserProfile = UserProfile

  constructor(private loginService: LoginService, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
  }

  async login(UserName: HTMLInputElement, Password: HTMLInputElement) {
    const transaltion = await this.getTransaltion("login");
    this.loginService.Login(UserName.value, Password.value)
      .subscribe(
        response => {

          if (response.user.idProfile != this.userProfile.client) {
            toastr.warning(transaltion.accesnonautorise, { positionClass: 'toast-top-center', containerId: 'toast-top-center' })
            return
          }

          if (response && response.token && response.user.passwordAlreadyChanged == 1 && response.user.actif == UserStatut.active) {
            localStorage.setItem('SBP_client_token', response.token);
            localStorage.setItem('SBP_client_USER', JSON.stringify(response.user));
            this.router.navigate(['/']);
            return
          }

          if (response && response.token && response.user.passwordAlreadyChanged == 0 && response.user.actif == UserStatut.active) {
            localStorage.setItem('SBP_client_token', response.token);
            localStorage.setItem('SBP_client_USER', JSON.stringify(response.user));
            this.router.navigate(['/login/change-password']);
            return
          }

          toastr.warning(transaltion.incorrectLogin, { positionClass: 'toast-top-center', containerId: 'toast-top-center' })
        },
        error => {
          toastr.warning(transaltion.incorrectLogin, { positionClass: 'toast-top-center', containerId: 'toast-top-center' })
        });
  }

  getTransaltion(key: string): Promise<any> {
    return new Promise((reject, resolve) => {
      this.translate.get(key).subscribe((transaltion: any) => {
        reject(transaltion)
      });
    });
  }
}
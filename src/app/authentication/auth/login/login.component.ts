import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LogoService } from '../../../services/logo.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { login } from '../../../state/auth/auth.actions';
import { fadeInOutAnimation } from '../../../shared/Animations/fadeInOut-animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: '../authentication.scss',
  animations: [fadeInOutAnimation],
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInOut') fadeInOut = true;
  @HostBinding('style.display') display = 'block';

  public loginForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private logoService: LogoService,
  ) {
    this.logoService.isToolbar = false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(
        login({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        }),
      );
      this.router.navigate(['features/usersManagement']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

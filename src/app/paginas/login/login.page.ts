import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //@ts-ignore
  formLogin:FormGroup;
  emailPattern:any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  spinner:any;

  constructor(private formBuilder: FormBuilder, private auth: AuthService)
  {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(".{6,}")]]});
  }
    
  ngOnInit() {}

  ngAfterViewInit()
  {
    this.spinner = document.querySelector(".hidden");
  }
    
  login()
  {
    if (this.formLogin.valid)
    {
      this.spinner.classList.remove("hidden");
      setTimeout( () => {
        this.auth.iniciarSesion(this.formLogin.value.email, this.formLogin.value.password);
      }, 1500);
      this.spinner.classList.add("hidden");
    }
  }      
}

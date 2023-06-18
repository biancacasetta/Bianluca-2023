import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //@ts-ignore
  formLogin:FormGroup;
  emailPattern:any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  spinner:boolean = false;
  clientesPendientes:any[] = [];
  clientesRechazados:any[] = [];
  popup:boolean = false;
  mensajePopup:string = "";

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private firestore: FirebaseService)
  {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(".{6,}")]]});
  }
    
  ngOnInit() {}

  ngAfterViewInit()
  {
    this.firestore.obtenerColeccion("clientes-pendientes").subscribe((data) => {
      this.clientesPendientes = data;
    });
    this.firestore.obtenerColeccion("clientes-rechazados").subscribe((data) => {
      this.clientesRechazados = data;
    });
  }

  verificarEmail(email:string)
  {
    let mensaje = "";

    this.clientesPendientes.forEach((cliente) => {
      if(cliente.email == email)
      {
        mensaje = "Pendiente";
      }
    });

    this.clientesRechazados.forEach((cliente) => {
      if(cliente.email == email)
      {
        mensaje = "Rechazado";
      }
    });

    return mensaje;
  }
    
  login()
  {
    this.spinner = true;
    
    if (this.formLogin.valid)
    {
      setTimeout( () => {

        let estado = this.verificarEmail(this.formLogin.value.email);
        switch(estado)
        {
          case "":
            this.auth.iniciarSesion(this.formLogin.value.email, this.formLogin.value.password)
            break;
          case "Pendiente":
            this.mensajePopup = "Aún no se procesó tu registro.";
            this.popup = true;
            break;
          case "Rechazado":
            this.mensajePopup = "Se rechazó tu registro y no podés iniciar sesión.";
            this.popup = true;
            break;
        }

        this.spinner = false;
      }, 2000);
    }
  }      
}

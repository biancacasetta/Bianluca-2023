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
    
  async login()
  {
    this.spinner = true;
    
    if (this.formLogin.valid)
    {
      setTimeout(async () => {

        let estado = this.verificarEmail(this.formLogin.value.email);
        switch(estado)
        {
          case "":
            await this.auth.iniciarSesion(this.formLogin.value.email, this.formLogin.value.password).then(() => {
              console.log("¡Login exitoso!");
              this.formLogin.reset();
            })
            .catch((error) => {
              this.mensajePopup = this.auth.crearMensaje(error.code);
              this.popup = true;
            });
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
    else
    {
      setTimeout(() => {
        this.spinner = false;
        this.mensajePopup = "Faltan completar campos";
        this.popup = true;
      }, 2000);
    }
  }
  
  insertarAccesosRapidos(perfil:string)
  {
    switch(perfil)
    {
      case "dueño":
        this.formLogin.get('email').setValue("duenio@duenio.com");
        this.formLogin.get('password').setValue("duenio");
        break;
      case "metre":
        this.formLogin.get('email').setValue("metre@metre.com");
        this.formLogin.get('password').setValue("metre1");
        break;
      case "mozo":
        this.formLogin.get('email').setValue("mozo1@mozos.com");
        this.formLogin.get('password').setValue("mozos1");
        break;
      case "cocinero":
        this.formLogin.get('email').setValue("cocinero@cocinero.com");
        this.formLogin.get('password').setValue("cocinero");
        break;
      case "bartender":
        this.formLogin.get('email').setValue("bartender@bartender.com");
        this.formLogin.get('password').setValue("bartender");
        break;
      case "cliente":
        this.formLogin.get('email').setValue("nahuquilmes2000@gmail.com");
        this.formLogin.get('password').setValue("quilmes");
        break;
    }
  }
}

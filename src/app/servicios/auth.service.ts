import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioAceptado:any;
  constructor( private router: Router, private angularFireAuth: AngularFireAuth,
    private firebaseServ:FirebaseService) { }

  iniciarSesion(email:string,contraseña:string)
  {
    try {
    this.angularFireAuth
        .setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
        .then(() => {
          this.angularFireAuth
            .signInWithEmailAndPassword(email, contraseña)
            .then((data) => {
              this.obtenerUsuarioPorEmail(email); 
              setTimeout(()=>{
                this.redirigirPorUsuario(this.usuarioAceptado.perfil);
              },1500);   
            })
            .catch((error) => {
              console.log(error.code);
            });
        })
        .catch((error) => {
          console.log(error.code);
        });
    } catch (error:any) {
      console.log(error.code);
    }
  }

  obtenerUsuarioPorEmail(email:string)
  {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
      res.forEach((usuario)=>{
        console.log(usuario);
        if(usuario.email == email)
        {
          this.usuarioAceptado = usuario;
        }
      })
    });
  }

  redirigirPorUsuario(perfil:string)
  {
    switch(perfil)
    {
      case "cliente":
        this.router.navigate(['/inicio-cliente']);
        break;
      case "dueño":
        case "supervisor":  
        this.router.navigate(['/dueno-supervisor']);
        break;
        //Falta agregar los otros tipos de usuarios
    }
  }

  cerrarSesion()
  {
    try
    {
      this.angularFireAuth.signOut().then(() => {
        setTimeout(() => {
          console.log("Sesión cerrada exitosamente.");
          this.router.navigate(['/login']);
        }, 2000);
      });
    } catch (error:any) {
      console.log(error.message);
    }
  }

  registrarUsuario(nuevoUsuario:any)
  {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsuario.email,nuevoUsuario.password)
    .then(()=>{
      alert(`Usuario ${nuevoUsuario.nombre} registrado exitosamente`);
      this.cerrarSesion();
    })
    .catch((error)=>{
      alert(error.code);
    })
  }

  crearMensaje(errorCode: string): string {
    let mensaje: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        mensaje = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        mensaje = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        mensaje = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        mensaje = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-not-found':
        mensaje = 'No existe ningún usuario con estos identificadores';
        break;
      default:
        mensaje = 'Dirección de email y/o contraseña incorrectos';
        break;
    }

    return mensaje;
  } // end of createMessage
}



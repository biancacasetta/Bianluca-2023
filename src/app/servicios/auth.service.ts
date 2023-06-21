import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { FirebaseService } from './firebase.service';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioAceptado:any;
  constructor( private router: Router, private angularFireAuth: AngularFireAuth,
    private firebaseServ:FirebaseService) { }

  iniciarSesion(email:string, contraseña:string){
    return new Promise((resolve, rejected) => {
      this.angularFireAuth.signInWithEmailAndPassword(email,contraseña).then(usuario =>{
        this.obtenerUsuarioPorEmail(email); 
        setTimeout(()=>{
          this.redirigirPorUsuario(this.usuarioAceptado.perfil);
        },1500);   
        resolve(usuario);
      })
      .catch(error => rejected(error));
    });
  }  

  obtenerUsuarioPorEmail(email:string)
  {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
      res.forEach((usuario)=>{
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
      case "metre":
        this.router.navigate(['/metre']);
        break;
      case "mozo":
        this.router.navigate(['/mozo']);
        break;  
      case "bartender":
        this.router.navigate(['bartender']);
        break;
      case "cocinero":
        this.router.navigate(['cocinero']);
        break;    
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
      case 'auth/operation-not-allowed':
        mensaje = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        mensaje = 'El email ya está registrado.';
        break;
      case 'auth/user-not-found':
        mensaje = 'No existe ningún usuario con estos datos';
        break;
      default:
        mensaje = 'Dirección de email y/o contraseña incorrectos';
        break;
    }

    return mensaje;
  }

  obtenerEmailUsuarioLogueado()
  {
    return firebase.auth().currentUser?.email;
  }
}



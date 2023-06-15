import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private router: Router, private angularFireAuth: AngularFireAuth) { }

  iniciarSesion(email:string,contraseña:string)
  {
    try {
    this.angularFireAuth
        .setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
        .then(() => {
          this.angularFireAuth
            .signInWithEmailAndPassword(email, contraseña)
            .then((data) => {
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              console.log(error.code);
            });
        })
        .catch((error) => {
          console.log(error.code);
        });
    } catch (error:any) {
      console.log(error.message);
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
  }



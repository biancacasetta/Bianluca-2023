import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { FirebaseService } from './firebase.service';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Firestore, collection, getDocs, updateDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< Updated upstream
  usuarioAceptado:any;
  listaUsuario: any []=[];
  constructor( private router: Router, private angularFireAuth: AngularFireAuth,
    private firebaseServ:FirebaseService) {
      this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
        this.listaUsuario = res;
      });
     }

  async iniciarSesion(email:string, contraseña:string){
    return new Promise((resolve, rejected) => {
      this.angularFireAuth.signInWithEmailAndPassword(email,contraseña).then(usuario =>{
        console.log("for");
        this.obtenerUsuarioPorEmail(email); 
        //setTimeout(()=>{
        this.redirigirPorUsuario(this.usuarioAceptado.perfil);
          
        //},1500);   
=======
  usuarioAceptado: any;
  constructor(private router: Router,
    private angularFireAuth: AngularFireAuth,
    private firebaseServ: FirebaseService,
    private firestore2: Firestore
  ) { }

  iniciarSesion(email: string, contraseña: string) {
    return new Promise((resolve, rejected) => {
      this.angularFireAuth.signInWithEmailAndPassword(email, contraseña).then(usuario => {
        this.obtenerUsuarioPorEmail(email);
        setTimeout(() => {
          this.redirigirPorUsuario(this.usuarioAceptado.perfil);
        }, 1500);
>>>>>>> Stashed changes
        resolve(usuario);
      })
        .catch(error => rejected(error));
    });
  }

<<<<<<< Updated upstream
  obtenerUsuarioPorEmail(email:string)
  {
    for (let i = 0; i < this.listaUsuario.length; i++) {;
      if(this.listaUsuario[i].email == email)
      {
        this.usuarioAceptado = this.listaUsuario[i];
        console.log(this.listaUsuario[i]);
        break;
      }
    }
=======
  obtenerUsuarioPorEmail(email: string) {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      res.forEach((usuario) => {
        if (usuario.email == email) {
          this.usuarioAceptado = usuario;
        }
      })
    });
>>>>>>> Stashed changes
  }

  async obtenerUsuarioPorEmail2(email: string) {
    const usersCol = collection(this.firestore2, 'usuarios-aceptados');
    const usersSnapshot = await getDocs(usersCol);
    const users = usersSnapshot.docs.map(doc => doc.data());

    return users.find(user => user['email'] === email);
  }

  redirigirPorUsuario(perfil: string) {
    switch (perfil) {
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

  cerrarSesion() {
    try {
      this.angularFireAuth.signOut().then(() => {
        setTimeout(() => {
          console.log("Sesión cerrada exitosamente.");
          this.router.navigate(['/login']);
        }, 2000);
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

<<<<<<< Updated upstream
  registrarUsuario(nuevoUsuario:any)
  {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsuario.email,nuevoUsuario.password)
    .then(()=>{
      console.log(`Usuario ${nuevoUsuario.nombre} registrado exitosamente`);
      //this.cerrarSesion();
      this.iniciarSesion('duenio@duenio.com','duenio');
    })
    .catch((error)=>{
      console.log(error.code);
    })
=======
  registrarUsuario(nuevoUsuario: any) {
    this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsuario.email, nuevoUsuario.password)
      .then(() => {
        console.log(`Usuario ${nuevoUsuario.nombre} registrado exitosamente`);
        this.cerrarSesion();
      })
      .catch((error) => {
        console.log(error.code);
      })
>>>>>>> Stashed changes
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

  obtenerEmailUsuarioLogueado() {
    return firebase.auth().currentUser?.email;
  }
}



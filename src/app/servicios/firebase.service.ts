import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private angularFirestore: AngularFirestore) { }

  obtenerColeccion(nombreColeccion:string)
  {
    const coleccion = this.angularFirestore.collection<any>(nombreColeccion);
    return coleccion.valueChanges();
  }

  agregarDocumento(dato:any,nombreColeccion:string)
  {
    return new Promise<void> ((resolve, rejected) => {
      this.angularFirestore.collection(nombreColeccion).doc(dato.dni + '.' + dato.hora).set({
      id: dato.dni + '.' + dato.hora,
      nombre: dato.nombre,
      apellido: dato.apellido,
      dni: dato.dni,
      email: dato.email,
      password: dato.password,
      hora: dato.hora,
      rutaFoto: dato.rutaFoto,
      perfil: dato.perfil,
    })
    .then(()=>{
      resolve();
    })
    .catch(error=>rejected(error))
  });
  }

  agregarDocumentoAnonimo(dato:any,nombreColeccion:string)
  {
    return new Promise<void> ((resolve, rejected) => {
      this.angularFirestore.collection(nombreColeccion).doc(dato.nombre + '.' + dato.hora).set({
      id: dato.nombre + '.' + dato.hora,
      nombre: dato.nombre,
      hora: dato.hora,
      perfil: dato.perfil,
    })
    .then(()=>{
      resolve();
    })
    .catch(error=>rejected(error))
  });
  }

  agregarDocumentoGenerico(datos:any,nombreColeccion:string)
  {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  

  eliminarDocumento(datoAEliminar:any,nombreColeccion:string)
  {
    this.angularFirestore
    .doc<any>(`${nombreColeccion}/${datoAEliminar.dni}.${datoAEliminar.hora}`)
    .delete()
    .then(() =>{
      console.log(`Se eliminó ${datoAEliminar.apellido} de la lista ${nombreColeccion}`);
    })
    .catch((error) =>{
      console.log(error.code);
    })
  }

  borrarFoto(rutaFoto:string){
    let storageRef = firebase.storage().ref();

    if (rutaFoto != "../../../assets/icon/foto-avatar-avif"){
    
      storageRef.listAll().then((lista)=>{
        lista.items.forEach(f => {
          f.getDownloadURL().then((link)=>{
            if (link == rutaFoto){    
              f.delete();
              console.log("foto borrada");
            }
          });
        });
      }).catch(e=>{
        console.log(e);
      });
    }
  }

}

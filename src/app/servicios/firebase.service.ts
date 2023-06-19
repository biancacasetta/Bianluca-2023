import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { QuerySnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private usuarioAnonimo:any;
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

  eliminarClientePorCampo(nombreVariable:string,valorVariable:string,nombreColeccion:string)
  {
    this.angularFirestore.collection(nombreColeccion, ref => ref.where(nombreVariable,'==',valorVariable)).get()
    .subscribe(QuerySnapshot => {
      QuerySnapshot.forEach(doc =>{
        doc.ref.delete();
      });
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
      comenzales: dato.comenzales
    })
    .then(()=>{
      this.usuarioAnonimo = dato;
      resolve();
    })
    .catch(error=>rejected(error))
  });
  }

  obtenerClienteAnonimo()
  {
    return this.usuarioAnonimo;
  }

  agregarDocumentoGenerico(datos:any,nombreColeccion:string)
  {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  

  eliminarDocumento(datoAEliminar:any,nombreColeccion:string)
  {
    this.angularFirestore
    .doc<any>(`${nombreColeccion}/${datoAEliminar.id}`)
    .delete()
    .then(() =>{
      console.log(`Se eliminó ${datoAEliminar.nombre} de la lista ${nombreColeccion}`);
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

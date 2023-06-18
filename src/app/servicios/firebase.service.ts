import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
      apellido: dato.apellido,
      nombre: dato.nombre,
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
}

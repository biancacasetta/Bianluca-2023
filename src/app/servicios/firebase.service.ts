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
    return this.angularFirestore.collection(nombreColeccion).add(dato);
  }

  eliminarDocumento(datoAEliminar:any,nombreColeccion:string)
  {
    this.angularFirestore
    .doc<any>(`${nombreColeccion}/${datoAEliminar.id}`)
    .delete()
    .then(() =>{
      console.log(`Se elimino ${datoAEliminar.apellido} de la lista ${nombreColeccion}`);
    })
    .catch((error) =>{
      console.log(error.code);
    })
  }
}

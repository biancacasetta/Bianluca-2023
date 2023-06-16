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
}

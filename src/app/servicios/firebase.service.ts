import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { QuerySnapshot, collection, doc, getDocs } from 'firebase/firestore';
import { ImagesService } from './images.service';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private usuarioAnonimo: any = null;
  private usuarioRegistrado: any = null;
  constructor(
    private angularFirestore: AngularFirestore,
    private imageService: ImagesService,
    private firestore2: Firestore
  ) { }

  obtenerColeccion(nombreColeccion: string) {
    const coleccion = this.angularFirestore.collection<any>(nombreColeccion);
    return coleccion.valueChanges();
  }

  async obtenerColeccion2(nombreColeccion: string) {
    const querySnapshot = await getDocs(collection(this.firestore2, nombreColeccion));
    return querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data()
      }
    });
  }

  agregarDocumento(dato: any, nombreColeccion: string) {
    return new Promise<void>((resolve, rejected) => {
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
        .then(() => {
          resolve();
        })
        .catch(error => rejected(error))
    });
  }

  guardarEncuestaCliente(datos: any) {
    return new Promise((resolve, rejected) => {
      this.angularFirestore.collection("encuestas-clientes").add({
        fecha: Date.now(),
        rangoEdad: datos.rangoEdad,
        gustosDelLocal: datos.gustosDelLocal,
        limpieza: datos.limpieza,
        recomendados: datos.recomendados,
        sugerencia: datos.comentario,
        fotos: datos.fotos
      }).catch(error => {
        alert(error);
        rejected(error)
      });
    });
  }

  eliminarClientePorCampo(nombreVariable: string, valorVariable: string, nombreColeccion: string) {
    this.angularFirestore.collection(nombreColeccion, ref => ref.where(nombreVariable, '==', valorVariable)).get()
      .subscribe(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }

  actualizarClientePorId(nombreColeccion: string, clienteActualizado: any) {
    this.angularFirestore.collection(nombreColeccion, ref => ref.where('id', '==', clienteActualizado.id)).get()
      .subscribe(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          doc.ref.update(clienteActualizado);
        });
      })
  }

  actualizarMesaPorId(mesaActualizada: any) {
    this.angularFirestore.collection('mesas', ref => ref.where('id', '==', mesaActualizada.id)).get()
      .subscribe(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          doc.ref.update(mesaActualizada);
        });
      })
  }


  actualizarPedidoPorId(pedidoActualizado: any, nombreColeccion: string) {
    this.angularFirestore.collection(nombreColeccion, ref => ref.where('id', '==', pedidoActualizado.id)).get()
      .subscribe(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          doc.ref.update(pedidoActualizado);
        });
      })
  }

  agregarDocumentoAnonimo(dato: any, nombreColeccion: string) {
    return new Promise<void>((resolve, rejected) => {
      this.angularFirestore.collection(nombreColeccion).doc(dato.id).set({
        id: dato.id,
        apellido: dato.apellido,
        nombre: dato.nombre,
        hora: dato.hora,
        rutaFoto: dato.rutaFoto,
        perfil: dato.perfil,
      })
        .then(() => {
          this.usuarioAnonimo = dato;
          resolve();
        })
        .catch(error => rejected(error))
    });
  }

  obtenerClienteAnonimo() {
    return this.usuarioAnonimo;
  }

  agregarDocumentoGenerico(datos: any, nombreColeccion: string) {
    return this.angularFirestore.collection(nombreColeccion).add(datos);
  }

  eliminarDocumento(datoAEliminar: any, nombreColeccion: string) {
    this.angularFirestore
      .doc<any>(`${nombreColeccion}/${datoAEliminar.id}`)
      .delete()
      .then(() => {
        console.log(`Se eliminó ${datoAEliminar.nombre} de la lista ${nombreColeccion}`);
      })
      .catch((error) => {
        console.log(error.code);
      })
  }

  borrarFoto(rutaFoto: string) {
    let storageRef = firebase.storage().ref();

    if (rutaFoto != "../../../assets/icon/foto-avatar-avif") {

      storageRef.listAll().then((lista) => {
        lista.items.forEach(f => {
          f.getDownloadURL().then((link) => {
            if (link == rutaFoto) {
              f.delete();
              console.log("foto borrada");
            }
          });
        });
      }).catch(e => {
        console.log(e);
      });
    }
  }

  elimiarColeccionChat() {
    this.angularFirestore.collection('chat').snapshotChanges().subscribe(documents => {
      documents.forEach(document => {
        const id = document.payload.doc.id;
        this.angularFirestore.collection('chat').doc(id).delete();
      });
    });
  }

  async createProduct(newProduct: any) {
    const photo1Ref = newProduct['photo1'];
    const photo2Ref = newProduct['photo2'];
    const photo3Ref = newProduct['photo3'];
    delete newProduct['photo1'];
    delete newProduct['photo2'];
    delete newProduct['photo3'];

    newProduct.tipo = 'comida';
    newProduct.cantidad = 0;

    const productId = await this.angularFirestore.collection('productos').add(newProduct).then(async (docRef) => {
      const image1Url = await this.imageService.uploadImage(photo1Ref, docRef.id + "_1").toPromise();
      const image2Url = await this.imageService.uploadImage(photo2Ref, docRef.id + "_2").toPromise();
      const image3Url = await this.imageService.uploadImage(photo3Ref, docRef.id + "_3").toPromise();
      const images = [image1Url, image2Url, image3Url];
      await this.angularFirestore.collection('productos').doc(docRef.id).update({
        id: docRef.id,
        images: images
      });
    });
  }

  async createReserva(usuario: any, selectedMesa: any, selectedDateTime: Date) {
    const querySnapshot = await getDocs(collection(this.firestore2, 'reservas'));

    for (const doc of querySnapshot.docs) {
      const reserva = doc.data();
      if (reserva['mesa'].id === selectedMesa.id && reserva['fechaHora'].toDate().getTime() === selectedDateTime.getTime() && reserva['estado'] === 'confirmada') {
        throw new Error('Esa mesa ya está ocupada en ese horario.');
      }
    }

    await this.angularFirestore.collection('reservas').add({ cliente: usuario, mesa: selectedMesa, fechaHora: selectedDateTime, estado: 'pendiente' })
      .then(async (docRef) => {
        await this.angularFirestore.collection('reservas').doc(docRef.id).update({
          id: docRef.id
        });
      });
  }

  actualizarEstado(reserva: any) {
    this.angularFirestore.collection('reservas').doc(reserva.id).update(reserva);
  }

  async createGoogleUser(user: any) {
    await this.angularFirestore.collection('clientes-pendientes').add(user).then(async (docRef) => {
      await this.angularFirestore.collection('clientes-pendientes').doc(docRef.id).update({
        id: docRef.id
      });
    });
  }

  async acceptGoogleUser(user: any) {
    await this.angularFirestore.collection('usuarios-aceptados').doc(user.id).set(user);
  }

  async rejectGoogleUser(user: any) {
    await this.angularFirestore.collection('clientes-rechazados').doc(user.id).set(user);
  }
}

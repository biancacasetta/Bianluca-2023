import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, concat, ignoreElements, defer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  // sube todo a userImages, cambiar
  uploadImage(file: File, name: string): Observable<string> {
    const fileRef = this.afStorage.ref(`/productos/${name}`);
    const task = this.afStorage.upload(`/productos/${name}`, file);
    return concat(
      task.snapshotChanges().pipe(ignoreElements()),
      defer(() => fileRef.getDownloadURL())
    );
  }
}

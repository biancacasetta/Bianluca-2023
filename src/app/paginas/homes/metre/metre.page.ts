import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-metre',
  templateUrl: './metre.page.html',
  styleUrls: ['./metre.page.scss'],
})
export class MetrePage implements OnInit {

  listaEspera:any[] = [];
  spinner:boolean = false;
  popup:boolean = false;

  constructor(private auth:AuthService, private firestore: FirebaseService) { }

  ngOnInit() {
    this.listaEspera = [];
    this.firestore.obtenerColeccion('lista-espera').subscribe((data)=>{
      this.listaEspera = data;
    });
  }

  cerrarSesion()
  {
    this.popup = false;
    this.activarSpinner();
    this.auth.cerrarSesion();
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  eliminarDeListaEspera()
  {
    const dato = {};
    this.firestore.eliminarDocumento(dato, "lista-espera");
    this.activarSpinner();
  }

}

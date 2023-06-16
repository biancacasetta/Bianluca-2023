import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-dueno-supervisor',
  templateUrl: './dueno-supervisor.page.html',
  styleUrls: ['./dueno-supervisor.page.scss'],
})
export class DuenoSupervisorPage implements OnInit {

  listaClientes:any[]=[];
  popUp:any;
  constructor(private firebaseServ:FirebaseService) { }

  ngOnInit() {
    this.cargarClientes();
  }

  ngAfterViewInit()
  {
    this.popUp = document.getElementById('contenedor-pop-up');
  }

  cargarClientes()
  {
    this.firebaseServ.obtenerColeccion('clientes-pendientes').subscribe((res)=>{
      this.listaClientes = res;
    });
  }

  aceptarCliente(cliente:any)
  {
    console.log("Aceptado: " + cliente);
    // Se cambia el estado del cliente a aceptado.
  }

  rechazarCliente(cliente:any)
  {
    console.log("Rechazado: " + cliente);
    // Se cambia el estado del cliente a rechazado

    //Damos razones por las cuales no fue aceptado, y enviamos mail.
    this.popUp.classList.remove("esconder");
  }

  cerrarPopUp()
  {
    this.popUp.classList.add("esconder");
  }
}

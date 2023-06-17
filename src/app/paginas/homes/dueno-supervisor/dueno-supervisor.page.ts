import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-dueno-supervisor',
  templateUrl: './dueno-supervisor.page.html',
  styleUrls: ['./dueno-supervisor.page.scss'],
})
export class DuenoSupervisorPage implements OnInit {

  listaClientes:any[]=[];
  popUp:any;
  formPopUp: FormGroup;
  razonesTouched:boolean = false;

  constructor(private firebaseServ:FirebaseService,
    private formBuilder:FormBuilder) { 
      this.formPopUp = this.formBuilder.group({
        razones: ['',[Validators.required,Validators.minLength(10), Validators.maxLength(40)]]
      })
    }

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

  aceptarCliente(clienteAceptado:any)
  {
    clienteAceptado.estado = "Esperando";
    this.firebaseServ.agregarDocumento(clienteAceptado,'clientes-aceptados');
    this.firebaseServ.eliminarDocumento(clienteAceptado,'clientes-pendientes');
    this.listaClientes = this.listaClientes.filter(cliente => cliente != clienteAceptado);
  }

  rechazarCliente(cliente:any)
  {
    this.firebaseServ.agregarDocumento(cliente,'clientes-rechazados');
    this.listaClientes = this.listaClientes.filter(cliente => cliente != cliente);

    //Damos razones por las cuales no fue aceptado, y enviamos mail.
    this.popUp.classList.remove("esconder");
  }

  enviarRazones()
  {
    this.razonesTouched = true;
    if(this.formPopUp.valid)
    {
      this.popUp.classList.add("esconder");
      console.log(this.formPopUp.getRawValue().razones);
      this.razonesTouched = false;
    }
  }
}

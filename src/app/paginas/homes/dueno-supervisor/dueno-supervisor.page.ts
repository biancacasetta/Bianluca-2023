import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { EmailComposer, EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';

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
  verificarCuentaCliente:boolean = false;
  clienteRechazado:any;

  constructor(private firebaseServ:FirebaseService,
    private formBuilder:FormBuilder,
    private emailComposer:EmailComposer) { 
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
    this.clienteRechazado = cliente;
    //Damos razones por las cuales no fue aceptado, y enviamos mail.
    this.popUp.classList.remove("esconder");
  }

  async enviarRazones()
  {
    this.razonesTouched = true;
    if(this.formPopUp.valid)
    {
      await this.emailComposer.hasAccount().then(async()=>{
        await this.emailComposer.isAvailable().then((estaDisponible:boolean)=>{
            if(estaDisponible)
            {
              this.enviarEmail(this.formPopUp.getRawValue().razones);
            }
            else
            {
              alert("No esta disponible");
            }
          });       
      }).catch((error)=>{
        alert(error.code);
      });

      this.popUp.classList.add("esconder");
      this.razonesTouched = false;
    }
  }

  async enviarEmail(contenido:string)
  {
    const estaPermitido = await this.emailComposer.hasPermission()

    if(estaPermitido)
    {
      console.log("Esta permitido");
      const email: EmailComposerOptions = {
        to: this.clienteRechazado.email,
        cc: 'noreply@bianluca.com',
        attachments: ['base64:../../../../assets/icon/icon.png'],
        subject: 'Razones por la cual no esta admitido',
        body: contenido,
        isHtml: true
      };
      this.emailComposer.open(email);
    }
    else
    {
      alert("No esta permitido");
    }

  }
}

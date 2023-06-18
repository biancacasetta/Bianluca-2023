import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FirebaseStorage, getStorage, ref, uploadString } from 'firebase/storage';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent  implements OnInit {
  @Output() escanearDNI: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarSpinner: EventEmitter<any> = new EventEmitter<any>();
  @Input() resultadoScanDni: any;

  //@ts-ignore
  formRegistro:FormGroup;
  emailPattern:any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  paginaRegistro = 1;
  fotoCapturada:any = "/assets/icon/foto-avatar.avif";

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private firestore: FirebaseService)
  {
    this.formRegistro = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern("[0-9]{8}")]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(".{6,}")]],
      confirmarPassword: ['', [Validators.required]]});
  }
  
  ngOnInit() {}

  ngAfterViewInit()
  {
    if(this.resultadoScanDni != undefined)
    {
      if(this.resultadoScanDni.length > 10) //DNI viejo
      {
        this.formRegistro.get('nombre').setValue(this.resultadoScanDni[5]);
        this.formRegistro.get('apellido').setValue(this.resultadoScanDni[4]);
        this.formRegistro.get('dni').setValue(this.resultadoScanDni[1].trim());
        if(this.resultadoScanDni[1].includes("F") || this.resultadoScanDni[1].includes("M"))
        {
          this.resultadoScanDni[1] = this.resultadoScanDni[1].replace('F', '0').replace('M', '0');
          alert(this.resultadoScanDni[1]);
          this.formRegistro.get('dni').setValue(this.resultadoScanDni[1]);
        }
      }
      else //DNI nuevo
      {
        this.formRegistro.get('nombre').setValue(this.resultadoScanDni[2]);
        this.formRegistro.get('apellido').setValue(this.resultadoScanDni[1]);
        this.formRegistro.get('dni').setValue(this.resultadoScanDni[4]);
      }
    }
  }
  
  escanearDni()
  {
    this.escanearDNI.emit();
  }

  async sacarFoto() {
    const foto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.fotoCapturada = foto.dataUrl;

  }
  
  registrarCliente()
  {
    if(this.formRegistro.valid)
    {
      this.activarSpinner.emit();
      
      let cliente = {
        nombre: this.formRegistro.value.nombre,
        apellido: this.formRegistro.value.apellido,
        dni: this.formRegistro.value.dni,
        email: this.formRegistro.value.email,
        password: this.formRegistro.value.password,
        perfil: "cliente"
      }
  
      this.firestore.agregarDocumento(cliente, "clientes-pendientes");
    }
  }

}

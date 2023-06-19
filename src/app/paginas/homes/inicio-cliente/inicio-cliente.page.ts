import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-inicio-cliente',
  templateUrl: './inicio-cliente.page.html',
  styleUrls: ['./inicio-cliente.page.scss'],
})
export class InicioClientePage implements OnInit {
  contadorPersonas:number = 1;
  popup:boolean = false;
  mensajePopUp:string = "";
  scannerActive: boolean = false;
  resultadoQR:string = "";
  usuarioLogueado:any;
  clienteEsperando:any = {};
  email:string = "";
  constructor(private authServ:AuthService,
    private vibration: Vibration,
    private firebaseServ:FirebaseService) { 

    }
    
  ngOnInit() 
  {   
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
      res.forEach((usuario)=>{
        if(usuario.email == this.authServ.obtenerEmailUsuarioLogueado())
        {
          this.usuarioLogueado = usuario;
        }
      })
    });
  }
  
   ngAfterViewInit()
  {

  }

  cerrarSesion()
  {
    this.authServ.cerrarSesion();
  }

  sumarPersonas()
  {
    if(this.contadorPersonas < 10)
    {
      this.contadorPersonas++;
    }
    else
    {
      this.popup = true;
      this.mensajePopUp = "El máximo permitido es de 10 personas.";
    }
  }

  restarPersonas()
  {
    if(this.contadorPersonas > 1)
    {
      this.contadorPersonas--;
    }
    else
    {
      this.popup = true;
      this.mensajePopUp = "Debe haber mínimo una persona.";
    }
  }


  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    this.scannerActive = true;
    const allowed = await this.checkPermission();
    if (allowed) {
      BarcodeScanner.hideBackground();
      const resultado = await BarcodeScanner.startScan();
      if (resultado.hasContent) {
        this.vibration.vibrate(300);
        if(this.usuarioLogueado.perfil != undefined)
        {
          this.clienteEsperando = this.usuarioLogueado;
        }
        else
        {
          this.clienteEsperando.nombre = this.usuarioLogueado.nombre;
        }
        this.clienteEsperando.comenzales = this.contadorPersonas;
        this.firebaseServ.agregarDocumentoGenerico(this.clienteEsperando,'lista-espera');
        this.scannerActive = false;
        this.contadorPersonas = 1;
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }


  stopScan()  {
    this.scannerActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }
}

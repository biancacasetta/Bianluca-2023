import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  spinner: boolean = false;
  modoRegistro: boolean = true;
  scannerActive: boolean = false;
  resultado:any;

  constructor(private vibration: Vibration) {}

  ngOnInit() {
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
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

  //PARA USAR DESDE LA PC
  async startScanner ()  {
    this.scannerActive = true;
    await BarcodeScanner.checkPermission({ force: true });
    BarcodeScanner.hideBackground();
    this.resultado = await BarcodeScanner.startScan();
    if(this.resultado.hasContent) {
      console.log(this.resultado.content);
      console.log("hay contenido");
    }
  };

  //PARA USAR DESDE EL CELULAR
  /*async startScanner() {
    this.scannerActive = true;
    const allowed = await this.checkPermission();
    if (allowed) {
      BarcodeScanner.hideBackground();
      this.resultado = await BarcodeScanner.startScan();
      if (this.resultado.hasContent) {
        this.vibration.vibrate(300);
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }*/

  stopScan()  {
    this.scannerActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }



}

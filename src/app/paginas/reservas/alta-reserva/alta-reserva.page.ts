import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FirebaseCloudMessagingService } from 'src/app/servicios/fcm.service';

@Component({
  selector: 'app-alta-reserva',
  templateUrl: './alta-reserva.page.html',
  styleUrls: ['./alta-reserva.page.scss'],
})
export class AltaReservaPage implements OnInit {

  cerrarSesionPopup: boolean = false;
  reservaCreadaPopup: boolean = false;
  errorPopup: boolean = false;
  spinner: boolean = false;

  selectedDateTimeString: string;
  selectedDateTime: Date;
  minDateTime: string;

  mesas: any[] = [];
  selectedMesa: any;

  usuarioLogueado: any;

  errorMessage = '';

  constructor(
    private firebaseServ: FirebaseService,
    private authServ: AuthService,
    private location: Location,
    private auth: AuthService,
    private fcmService: FirebaseCloudMessagingService
  ) { }

  ngOnInit() {
    this.firebaseServ.obtenerColeccion('usuarios-aceptados').subscribe((res) => {
      res.forEach((usuario) => {
        if (usuario.email == this.authServ.obtenerEmailUsuarioLogueado()) {
          this.usuarioLogueado = usuario;
        }
      })
    });

    this.auth.obtenerEmailUsuarioLogueado();
    this.minDateTime = this.getFormattedDateTime(new Date()); // Set the minimum date and time (current date and time)
    this.firebaseServ.obtenerColeccion('mesas').subscribe((res) => {
      this.mesas = res;
    });
  }

  async hacerReserva() {
    this.spinner = true;
    try {
      await this.firebaseServ.createReserva(this.usuarioLogueado, this.selectedMesa, this.selectedDateTime);
      this.fcmService.nuevaReservaPushNotification(this.selectedDateTime);
      this.reservaCreadaPopup = true;
    }
    catch (e: any) {
      this.errorPopup = true;
      this.errorMessage = e.message;
    } finally {
      this.spinner = false;
    }
  }

  onSelectMesa(mesaId: string) {
    this.selectedMesa = this.mesas.find(mesa => mesa.id === +mesaId);
    console.log('Mesa elegida:', this.selectedMesa);
  }

  onChange() {
    // Handle the selectedDateTime value change if needed
    this.selectedDateTime = new Date(this.selectedDateTimeString);
    console.log(this.selectedDateTime);
  }

  private getFormattedDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }

  volverAtras() {
    this.location.back();
  }

  cerrarSesion() {
    this.cerrarSesionPopup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  activarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }
}

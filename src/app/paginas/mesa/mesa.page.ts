import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  spinner:boolean = false;
  popup:boolean = false;
  mesa:any = {};

  constructor(private auth:AuthService) { }

  ngOnInit() {
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

}

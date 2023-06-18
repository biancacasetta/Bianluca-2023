import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-inicio-cliente',
  templateUrl: './inicio-cliente.page.html',
  styleUrls: ['./inicio-cliente.page.scss'],
})
export class InicioClientePage implements OnInit {
  
  constructor(private authServ:AuthService) { }

  ngOnInit() {
  }

  cerrarSesion()
  {
    this.authServ.cerrarSesion();
  }

}

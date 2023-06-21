import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-cocinero',
  templateUrl: './cocinero.page.html',
  styleUrls: ['./cocinero.page.scss'],
})
export class CocineroPage implements OnInit {
  popup:boolean=false;
  listaPedidosCocinero:any []=[];
  listaPedidosGenerales:any []=[];
  spinner:boolean = false;
  constructor(private firebaseServ:FirebaseService,
    private authServ:AuthService) { }

  ngOnInit() {
    this.firebaseServ.obtenerColeccion('pedidos-cocinero').subscribe((pedidos)=>{
      this.listaPedidosCocinero = pedidos;
    });
    this.firebaseServ.obtenerColeccion('pedidos').subscribe((pedidos)=>{
      this.listaPedidosGenerales = pedidos;
    });
  } 

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  cerrarSesion()
  {
    this.popup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  terminarPedido(pedidoCocinero:any)
  {
    this.cambiarEstadoItem(pedidoCocinero);
    pedidoCocinero.terminado = true;
    this.firebaseServ.actualizarPedidoPorId(pedidoCocinero,'pedidos-cocinero');
    this.actualizarPedidoMozo(pedidoCocinero);
    this.activarSpinner();
    //SOLO LA PARTE DEL PEDIDO DEL COCINERO SE TERMINA
  }

  cambiarEstadoItem(pedido:any)
  {
    pedido.items.forEach((item:any) => {
      item.terminado = true;
    });
  }

  actualizarPedidoMozo(pedidoCocinero:any)
  {
    this.listaPedidosGenerales.forEach((pedido:any)=>{
      if(pedido.id == pedidoCocinero.id)
      {
        pedido.items.forEach((item:any)=>{
          if(item.tipo == 'comida' || item.tipo == 'postre')
          {
            item.terminado = true;
          }
        });
        this.firebaseServ.actualizarPedidoPorId(pedido,'pedidos');
      }
    })
  }
}

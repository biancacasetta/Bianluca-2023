import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {
  listaPedidosBartender:any []=[];
  listaPedidosGenerales:any []=[];
  spinner:any;
  constructor(private firebaseServ:FirebaseService) { }

  ngOnInit() {
    this.firebaseServ.obtenerColeccion('pedidos').subscribe((pedidos)=>{
      this.listaPedidosGenerales = pedidos;
    });
    this.firebaseServ.obtenerColeccion('pedidos-bartender').subscribe((pedidosBartender)=>{
      this.listaPedidosBartender = pedidosBartender;
    });
  } 

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }


  terminarPedido(pedidosBartender:any)
  {
    this.cambiarEstadoItem(pedidosBartender);
    pedidosBartender.terminado = true;
    this.firebaseServ.actualizarPedidoPorId(pedidosBartender,'pedidos-bartender');
    this.actualizarPedidoMozo(pedidosBartender);
    this.activarSpinner();
    //SOLO LA PARTE DEL PEDIDO DEL COCINERO SE TERMINA
  }

  cambiarEstadoItem(pedido:any)
  {
    pedido.items.forEach((item:any) => {
      item.terminado = true;
    });
  }

  actualizarPedidoMozo(pedidoBartender:any)
  {
    this.listaPedidosGenerales.forEach((pedido:any)=>{
      if(pedido.id == pedidoBartender.id)
      {
        pedido.items.forEach((item:any)=>{
          if(item.tipo == 'bebida')
          {
            item.terminado = true;
          }
        });
        this.firebaseServ.actualizarPedidoPorId(pedido,'pedidos');
      }
    })
  }
}

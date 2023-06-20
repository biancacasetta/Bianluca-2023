import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mozo',
  templateUrl: './mozo.page.html',
  styleUrls: ['./mozo.page.scss'],
})
export class MozoPage implements OnInit {
  listaPedidos:any []=[];
  pantalla:string = 'solicitados';
  pedidosSolicitados:any []=[];
  pedidosEnPreparacion:any []=[];
  pedidosTerminado:any []=[];
  spinner:boolean = false;
  //@ts-ignore
  constructor(private firebaseServ:FirebaseService) 
  { 
  }
  
  verificarItems(pedido:any)
  {
    let pedidoTerminado = false;
    if(pedido.estado == 'En preparación')
    {
      pedidoTerminado = true;
      for(let i = 0; i < pedido.items.length; i++)
      {
        if(!pedido.items[i].terminado)
        {
          pedidoTerminado = false;
        }
      }
    }
    return pedidoTerminado;
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }


  ngOnInit() {
    this.firebaseServ.obtenerColeccion('pedidos').subscribe((pedidos)=>{
      this.listaPedidos = pedidos;
      this.seccionarPedidos(this.listaPedidos);
      pedidos.forEach((pedido)=>{
        if(this.verificarItems(pedido))
        {
          pedido.estado = 'Terminado';
          this.firebaseServ.actualizarPedidoPorId(pedido,'pedidos');
        }
      })  
    });
  } 
  
  seccionarPedidos(pedidos:any)
  {
    this.pedidosSolicitados = [];
    this.pedidosTerminado = [];
    this.pedidosEnPreparacion = [];
    pedidos.forEach((pedido:any) => {
      switch(pedido.estado)
      {
        case 'Solicitado':
          this.pedidosSolicitados.push(pedido);
          break;
        case 'En preparación':
          this.pedidosEnPreparacion.push(pedido);
          break;
        case 'Terminado':
          this.pedidosTerminado.push(pedido);
          break;    
      }
    });
  }

  listarPedido(pedido:any)
  {
    pedido.estado = 'En preparación';
    this.firebaseServ.actualizarPedidoPorId(pedido,'pedidos');
    let itemsCocinero: any[]=[];
    let itemsBartender: any[]=[];
    pedido.items.forEach((item:any)=>{
      if(item.tipo == 'comida' || item.tipo == 'postre')
      {
        itemsCocinero.push(item);
      }
      else
      {
        itemsBartender.push(item);
      }
    });
    if(itemsCocinero.length > 0)
    {
      let pedidoCocinero = {
        id: pedido.id,
        items: itemsCocinero,
        terminado: false
      }
      this.firebaseServ.agregarDocumentoGenerico(pedidoCocinero,'pedidos-cocinero');
    }

    if(itemsBartender.length > 0)
    {
      let pedidoBartender =
      {
        id: pedido.id,
        items: itemsBartender,
        terminado: false
      }
      this.firebaseServ.agregarDocumentoGenerico(pedidoBartender,'pedidos-bartender');
    }
    this.activarSpinner();
  }

  entregarPedido(pedido:any)
  {
    pedido.estado = 'Entregado';
    this.firebaseServ.actualizarPedidoPorId(pedido,'pedidos');
    this.activarSpinner();
  }

}

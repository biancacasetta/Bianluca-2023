import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
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
  pedidosPagados:any []=[];
  listaMesas:any []=[];
  spinner:boolean = false;
  popup:boolean = false;
  mesa:any;
  //@ts-ignore
  constructor(private firebaseServ:FirebaseService,
    private authServ:AuthService) 
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
    this.firebaseServ.obtenerColeccion('mesas').subscribe((mesas)=>{
      this.listaMesas = mesas;
    });
  } 
  
  seccionarPedidos(pedidos:any)
  {
    this.pedidosSolicitados = [];
    this.pedidosTerminado = [];
    this.pedidosEnPreparacion = [];
    this.pedidosPagados = [];
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
      if(pedido.pagado)
      {
        this.pedidosPagados.push(pedido);
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
        idMesa: pedido.mesa,
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
        idMesa: pedido.mesa,
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

  cerrarSesion()
  {
    this.popup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  confirmarPago(pedido:any)
  {
    this.obtenerMesa(pedido.mesa)
    this.mesa.ocupada = false;
    this.mesa.cliente = new Array();
    this.firebaseServ.actualizarMesaPorId(this.mesa);
  }

  async obtenerMesa(idMesa:any) 
  {
    for (let i = 0; i < this.listaMesas.length; i++) {
      if(this.listaMesas[i].id == idMesa)
      {
        this.mesa = this.listaMesas[i];
      }
    }
  }
}

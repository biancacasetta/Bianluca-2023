import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.page.html',
  styleUrls: ['./bartender.page.scss'],
})
export class BartenderPage implements OnInit {
  listaPedidos:any []=[];
  constructor(private firebaseServ:FirebaseService) { }

  ngOnInit() {
    this.firebaseServ.obtenerColeccion('pedidos').subscribe((pedidos)=>{
      this.listaPedidos = pedidos;
    });
  } 

  terminarPedido(pedido:any)
  {
    pedido.estado = 'Terminado';
    this.firebaseServ.actualizarPedidoPorId(pedido);
    //SOLO LA PARTE DEL PEDIDO DEL COCINERO SE TERMINA
  }
}

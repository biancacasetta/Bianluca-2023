import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-cocinero',
  templateUrl: './cocinero.page.html',
  styleUrls: ['./cocinero.page.scss'],
})
export class CocineroPage implements OnInit {

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

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  spinner:boolean = false;
  popup:boolean = false;
  mensajePopup:string = "";
  listaProductos:any[] = [];
  listaComidas:any[] = [];
  listaBebidas:any[] = [];
  listaPostres:any[] = [];
  precioTotal:number = 0;
  carrito:boolean = false;
  pedido:any[] = [];
  hayPedido:boolean = false;
  usuarioLogueado:any = null;
  usuarioAnonimo:any = null;
  mesa:any;

  imagenesComida:any = [
    [
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg"
    ],
    [
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg"
    ],
    [
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen2.jpg",
      "/assets/mesa/ramen1.jpg"
    ]
  ];

  imagenesBebida:any = [
    [
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg"
    ],
    [
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg"
    ],
    [
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen1.jpg"
    ]
  ];

  imagenesPostre:any = [
    [
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi1.jpeg"
    ],
    [
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri1.jpeg"
    ],
    [
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen1.jpg"
    ]
  ];

  constructor(private auth:AuthService, private firestore: FirebaseService) { }

  ngOnInit() {
    this.mensajePopup = "Bienvenido a su mesa. Ya puede hacer sus pedidos.";
    this.popup = true;

    this.firestore.obtenerColeccion("productos").subscribe((data) => {
      this.listaProductos = data;
      this.separarProductos(this.listaProductos);
    });

    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
      res.forEach((usuario)=>{
        if(usuario.email == this.auth.obtenerEmailUsuarioLogueado())
        {
          this.usuarioLogueado = usuario;
        }
    })
    });

    this.usuarioAnonimo = this.firestore.obtenerClienteAnonimo();
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

  restarCantidad(producto:any)
  {
    if(producto.cantidad > 0)
    {
      producto.cantidad--;
    }

    this.precioTotal -= producto.precio;
  }

  sumarCantidad(producto:any)
  {
    producto.cantidad++;

    this.precioTotal += producto.precio;
  }

  separarProductos(productos:any)
  {
    for (let i = 0; i < productos.length; i++) {
      
      switch(productos[i].tipo)
      {
        case "comida":
          this.listaComidas.push(productos[i]);
          break;
        case "bebida":
          this.listaBebidas.push(productos[i]);
          break;
        case "postre":
          this.listaPostres.push(productos[i]);
          break;
      } 
    }
  }

  generarDetallePedido()
  {
    this.activarSpinner();
    this.carrito = true;
    this.pedido = [];

    this.listaComidas.forEach((comida) => {
      if(comida.cantidad > 0)
      {
        let itemPedido = {
          nombre: comida.nombre,
          cantidad: comida.cantidad,
          precio: comida.precio * comida.cantidad,
          tipo: comida.tipo
        };

        this.pedido.push(itemPedido);
      }
    });

    this.listaBebidas.forEach((bebida) => {
      if(bebida.cantidad > 0)
      {
        let itemPedido = {
          nombre: bebida.nombre,
          cantidad: bebida.cantidad,
          precio: bebida.precio * bebida.cantidad,
          tipo: bebida.tipo
        };

        this.pedido.push(itemPedido);
      }
    });

    this.listaPostres.forEach((postre) => {
      if(postre.cantidad > 0)
      {
        let itemPedido = {
          nombre: postre.nombre,
          cantidad: postre.cantidad,
          precio: postre.precio * postre.cantidad,
          tipo: postre.tipo
        };

        this.pedido.push(itemPedido);
      }
    });

    console.log(this.pedido);
  }

  confirmarPedido(detallePedido:any)
  {
    this.activarSpinner();
    this.resetearCantidades();
    this.carrito = false;

    const pedido = {
      precio: this.precioTotal,
      items: detallePedido,
      estado: "Solicitado"
    };

    this.firestore.agregarDocumentoGenerico(pedido, "pedidos");

    this.hayPedido = true;

    this.mensajePopup = "El pedido se realizó con éxito";
    this.popup = true;
  }

  resetearCantidades()
  {
    this.precioTotal = 0;

    this.listaComidas.forEach((comida) => {
      if(comida.cantidad > 0)
      {
        comida.cantidad = 0;
      }
    });

    this.listaBebidas.forEach((bebida) => {
      if(bebida.cantidad > 0)
      {
        bebida.cantidad = 0;
      }
    });

    this.listaPostres.forEach((postre) => {
      if(postre.cantidad > 0)
      {
        postre.cantidad = 0;
      }
    });
  }
}

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
  logout:boolean = false;
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
  mesas:any;
  titulo:string = "";

  imagenesComida:any = [
    [
      "/assets/mesa/sushi1.jpeg",
      "/assets/mesa/sushi2.jpg",
      "/assets/mesa/sushi3.jpg"
    ],
    [
      "/assets/mesa/onigiri1.jpeg",
      "/assets/mesa/onigiri2.jpg",
      "/assets/mesa/onigiri3.jpg"
    ],
    [
      "/assets/mesa/ramen1.jpg",
      "/assets/mesa/ramen2.jpg",
      "/assets/mesa/ramen3.jpg"
    ]
  ];

  imagenesBebida:any = [
    [
      "/assets/mesa/leche-banana1.jpg",
      "/assets/mesa/leche-banana2.jpeg",
      "/assets/mesa/leche-banana3.jpg"
    ],
    [
      "/assets/mesa/sake1.jpg",
      "/assets/mesa/sake2.jpg",
      "/assets/mesa/sake3.jpg"
    ],
    [
      "/assets/mesa/matcha1.jpg",
      "/assets/mesa/matcha2.jpg",
      "/assets/mesa/matcha3.jpg"
    ]
  ];

  imagenesPostre:any = [
    [
      "/assets/mesa/dorayaki1.jpg",
      "/assets/mesa/dorayaki2.jpg",
      "/assets/mesa/dorayaki3.jpg"
    ],
    [
      "/assets/mesa/mochi1.jpeg",
      "/assets/mesa/mochi2.jpg",
      "/assets/mesa/mochi3.jpg"
    ],
    [
      "/assets/mesa/taiyaki1.jpg",
      "/assets/mesa/taiyaki2.jpg",
      "/assets/mesa/taiyaki3.jpg"
    ]
  ];

  constructor(private auth:AuthService, private firestore: FirebaseService)
  {
    this.firestore.obtenerColeccion('usuarios-aceptados').subscribe((res)=>{
      res.forEach((usuario)=>{
        
        if(usuario.email != undefined && usuario.email == this.auth.obtenerEmailUsuarioLogueado())
        {
          this.usuarioLogueado = usuario;

          this.firestore.obtenerColeccion("mesas").subscribe((data) => {
            data.forEach((mesa) => {
              if(mesa.cliente != undefined && mesa.cliente.id == usuario.id)
              {
                this.mesa = mesa;
                this.titulo = `MESA ${this.mesa.id} - ${this.usuarioLogueado.nombre}`;
              }
            })
          });
        }

      });
    });
    
    this.usuarioAnonimo = this.firestore.obtenerClienteAnonimo();
    if(this.usuarioAnonimo != null)
    {
      this.usuarioLogueado = null;
      this.firestore.obtenerColeccion("mesas").subscribe((data) => {
        data.forEach((mesa) => {
          if(mesa.cliente != undefined && mesa.cliente.id == this.usuarioAnonimo.id)
          {
            this.mesa = mesa;
            this.titulo = `MESA ${this.mesa.id} - ${this.usuarioAnonimo.nombre}`;
          }
        });
      });
    }
    
    
  }

  ngOnInit() {
    this.mensajePopup = "Bienvenido a su mesa. Ya puede hacer sus pedidos.";
    this.popup = true;

    this.firestore.obtenerColeccion("productos").subscribe((data) => {
      this.listaProductos = data;
      this.separarProductos(this.listaProductos);
    });
  }

  ngOnDestroy()
  {
    this.cerrarSesion();
  }

  cerrarSesion()
  {
    this.logout = false;
    this.usuarioLogueado = null;
    this.usuarioAnonimo = null;
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
          tipo: comida.tipo,
          terminado: false
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
          tipo: bebida.tipo,
          terminado: false
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
          tipo: postre.tipo,
          terminado: false
        };

        this.pedido.push(itemPedido);
      }
    });

  }

  confirmarPedido(detallePedido:any)
  {
    this.activarSpinner();
    this.resetearCantidades();
    this.carrito = false;

    const fecha = new Date().getTime();
    let nombre = "";

    if(this.usuarioAnonimo)
    {
      nombre = this.usuarioAnonimo.nombre;
    }
    else
    {
      nombre = this.usuarioLogueado.nombre + " " + this.usuarioLogueado.apellido;
    }

    const pedido = {
      precio: this.precioTotal,
      items: detallePedido,
      estado: "Solicitado",
      id: this.mesa.id + "." + fecha,
      mesa: this.mesa.id,
      nombre: nombre
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

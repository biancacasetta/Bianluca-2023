import { Component, OnInit } from '@angular/core';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FotoService } from 'src/app/servicios/foto.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {
  nivelLimpieza:string = "0";
  valorSelect:string = "";
  rangoEdad:string = "";
  comentario:string = "";
  recomendadosCumpleanios:boolean = false;
  recomendadosFamilia:boolean = false;
  recomendadosTrabajo:boolean = false;
  error:string = "";
  errorFotos = false;
  arrayFotos:any = new Array();
  usuarioLogueado:any;
  usuarioAnonimo:any;
  usuario:any;
  mesa:any;
  spinner:any;
  constructor(private vibracion:Vibration,
    private fotoServ:FotoService,
    private firestore:FirebaseService,
    private auth:AuthService) {
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
                }
              })
            });
          }
  
        });
      });
      
      this.usuarioAnonimo = this.firestore.obtenerClienteAnonimo();
      if(this.usuarioAnonimo != null)
      {
        console.log(this.usuarioAnonimo);
        this.usuarioLogueado = null;
        this.firestore.obtenerColeccion("mesas").subscribe((data) => {
          data.forEach((mesa) => {
            if( mesa.cliente.id == this.usuarioAnonimo.id)
            {
              this.mesa = mesa;
              console.log(this.mesa);
            }
          });
        });
      }
     }

  ngOnInit() {
  }

  verificarUsuario()
  {
    if(this.usuarioAnonimo != null)
    {
      this.usuario = this.usuarioAnonimo;
    }
    else
    {
      this.usuario = this.usuarioLogueado;
    }
  }

  cammbiarValorLimpieza(e:any) {
    this.nivelLimpieza = e.detail.value;
  }

  cambiarValorSelect(e:any)
  {
    this.valorSelect = e.detail.value;
  }

  cambiarEdad(e:any)
  {
    switch (e.detail.value) {
      case "13a20":
        this.rangoEdad = "13 a 20";
        break;
      case "20a30":
        this.rangoEdad = "20 a 30";
        break;
      case "30a40":
        this.rangoEdad = "30 a 40";
        break;
      case "40mas":
        this.rangoEdad = "40+";
        break;
      default:
        break;
    }
  }

  cambiarValorRecomendadosCumpleanios(e:any) {
    if (!this.recomendadosCumpleanios) {
      this.recomendadosCumpleanios = true;
    }
    else {
      this.recomendadosCumpleanios = false;
    }
  }

  cambiarValorRecomendadosFamilia(e:any) {
    if (!this.recomendadosFamilia) {
      this.recomendadosFamilia = true;
    }
    else {
      this.recomendadosFamilia = false;
    }
  }

  cambiarValorRecomendadosTrabajo(e:any) {
    if (!this.recomendadosTrabajo) {
      this.recomendadosTrabajo = true;
    }
    else {
      this.recomendadosTrabajo = false;
    }
  }

  vibrar()
  {
    this.vibracion.vibrate(5000);
    setTimeout (() => {
      this.vibracion.vibrate(0);
   }, 2000);
  }

  validarRespuestas()
  {
    if(this.rangoEdad == "")
    {
      this.error = "Debe seleccionar una edad.";
      this.vibrar();
    }
    else if(this.valorSelect == "")
    {
      this.error = "Debe seleccionar que le gusto del local.";
      this.vibrar();
    }
    else if(this.errorFotos)
    {
      this.error = "Puede seleccionar 3 fotos como máximo.";
      this.vibrar();
    }
  }

  async obtenerFotosEncuesta()
  {
    let foto = {
      usuario: this.usuario,
      hora: ''
    }
    await this.fotoServ.obtenerImagenes(foto);
    this.activarSpinner();
    setTimeout(()=>{
      this.arrayFotos = this.fotoServ.obtenerArrayFotos();
      if(this.arrayFotos.length > 3)
      {
        this.errorFotos = true;
        this.arrayFotos = new Array();
      }
      else
      {
        this.errorFotos = false;
      }
      this.fotoServ.limpiarArrayFotos();
    },1800);
  }

  activarSpinner()
  {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }

  async enviarRespuestas()
  {
    this.error = "";
    this.validarRespuestas();

    if(this.error == "")
    {
      let arrayRecomendados = new Array();
      if(this.recomendadosCumpleanios)
      {
        arrayRecomendados.push("Cumpleaños");
      }
      if(this.recomendadosFamilia)
      {
        arrayRecomendados.push("Familia");
      }
      if(this.recomendadosTrabajo)
      {
        arrayRecomendados.push("Trabajo");
      }
      
      let datos =
      {
        recomendados: arrayRecomendados,
        mesa: this.mesa.id, //CONSEGUIR MESA
        idCliente: this.usuario.id, //CONSEGUIR CLIENTE
        rangoEdad: this.rangoEdad,
        gustosDelLocal: this.valorSelect,
        limpieza: this.nivelLimpieza,
        comentario: this.comentario,
        fotos: this.arrayFotos 
      }
      this.firestore.guardarEncuestaCliente(datos);
      console.log(datos);
      //SERVICIO PARA SUBIR A DB LA ENCUESTA
    }
  }
}

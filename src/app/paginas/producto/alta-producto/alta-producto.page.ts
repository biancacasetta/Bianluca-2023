import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, Location } from '@angular/common'
import { AuthService } from 'src/app/servicios/auth.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage implements OnInit {

  cerrarSesionPopup: boolean = false;
  productoCreadoPopup: boolean = false;
  spinner: boolean = false;

  productForm: FormGroup;

  // Image
  image1IsLoaded = false;
  image1Src: string | ArrayBuffer | null;

  image2IsLoaded = false;
  image2Src: string | ArrayBuffer | null;

  image3IsLoaded = false;
  image3Src: string | ArrayBuffer | null;

  amount: number | null;
  formattedAmount: any;

  minutes: number;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseServ: FirebaseService,
    private authServ: AuthService,
    private location: Location,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      duracion: ['', Validators.required],
      precio: ['', Validators.required],
      photo1: ['', Validators.required],
      photo2: ['', Validators.required],
      photo3: ['', Validators.required]
    });
  }

  async createProduct() {
    if (this.productForm.valid) {
      this.spinner = true;

      try {
        await this.firebaseServ.createProduct(this.productForm.value);

        this.productoCreadoPopup = true;
      }
      catch (e: any) {
        // this.vibration.vibrate(1000);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error',
        //   text: e.message,
        //   heightAuto: false
        // })

        console.log(e);
      }

      this.spinner = false;
    } else {
      // this.vibration.vibrate(1000);
      this.productForm.markAllAsTouched();
    }
  }

  async takePicture() {
    // Take a photo
    const capturedPhoto1 = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    this.image1Src = capturedPhoto1.webPath!;
    this.image1IsLoaded = true;

    fetch(capturedPhoto1.webPath!).then((e) => {
      e.blob().then((blob) => {
        const file = new File([blob], 'auxImage', { type: 'image/png' });
        this.productForm.get('photo1')!.setValue(file);
      });
    });

    const capturedPhoto2 = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    this.image2Src = capturedPhoto2.webPath!;
    this.image2IsLoaded = true;

    fetch(capturedPhoto2.webPath!).then((e) => {
      e.blob().then((blob) => {
        const file = new File([blob], 'auxImage', { type: 'image/png' });
        this.productForm.get('photo2')!.setValue(file);
      });
    });

    const capturedPhoto3 = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    this.image3Src = capturedPhoto3.webPath!;
    this.image3IsLoaded = true;

    fetch(capturedPhoto3.webPath!).then((e) => {
      e.blob().then((blob) => {
        const file = new File([blob], 'auxImage', { type: 'image/png' });
        this.productForm.get('photo3')!.setValue(file);
      });
    });
  };

  transformAmount(element: any) {
    this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$');

    element.target.value = this.formattedAmount;

    this.productForm.controls['precio'].setValue(parseFloat(this.formattedAmount.replace("$", "").replace(",", "")));
  }

  volverAtras() {
    this.location.back();
  }

  cerrarSesion() {
    this.cerrarSesionPopup = false;
    this.activarSpinner();
    this.authServ.cerrarSesion();
  }

  activarSpinner() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 2000);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaProductoPageRoutingModule } from './alta-producto-routing.module';

import { AltaProductoPage } from './alta-producto.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaProductoPageRoutingModule,
    SpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [AltaProductoPage],
  providers: [CurrencyPipe]
})
export class AltaProductoPageModule { }

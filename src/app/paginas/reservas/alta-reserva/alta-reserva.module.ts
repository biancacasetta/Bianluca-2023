import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaReservaPageRoutingModule } from './alta-reserva-routing.module';

import { AltaReservaPage } from './alta-reserva.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    AltaReservaPageRoutingModule
  ],
  declarations: [AltaReservaPage]
})
export class AltaReservaPageModule { }

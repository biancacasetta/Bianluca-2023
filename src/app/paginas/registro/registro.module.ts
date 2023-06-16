import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';

import { RegistroClienteComponent } from 'src/app/componentes/registro-cliente/registro-cliente.component';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpinnerModule,
    RegistroPageRoutingModule,
    ReactiveFormsModule 
  ],
  declarations: [RegistroPage, RegistroClienteComponent]
})
export class RegistroPageModule {}

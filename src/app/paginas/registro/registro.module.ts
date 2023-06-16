import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';
import { SpinnerComponent } from 'src/app/componentes/spinner/spinner.component';
import { RegistroClienteComponent } from 'src/app/componentes/registro-cliente/registro-cliente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ReactiveFormsModule 
  ],
  declarations: [RegistroPage, SpinnerComponent, RegistroClienteComponent]
})
export class RegistroPageModule {}

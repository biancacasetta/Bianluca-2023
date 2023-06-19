import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioClientePageRoutingModule } from './inicio-cliente-routing.module';

import { InicioClientePage } from './inicio-cliente.page';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioClientePageRoutingModule
  ],
  providers: [Vibration],
  declarations: [InicioClientePage]
})
export class InicioClientePageModule {}

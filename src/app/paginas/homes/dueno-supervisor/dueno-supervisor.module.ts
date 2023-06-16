import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuenoSupervisorPageRoutingModule } from './dueno-supervisor-routing.module';

import { DuenoSupervisorPage } from './dueno-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuenoSupervisorPageRoutingModule
  ],
  declarations: [DuenoSupervisorPage]
})
export class DuenoSupervisorPageModule {}

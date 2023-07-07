import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaReservaPage } from './alta-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: AltaReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaReservaPageRoutingModule {}

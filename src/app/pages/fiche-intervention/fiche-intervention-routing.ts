import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './fiche-intervention-index/index.component';
import { ShowComponent } from './fiche-intervention-details/show.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: 'detail/:id',
        component: ShowComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FicheInterventionsRoutingModule { }

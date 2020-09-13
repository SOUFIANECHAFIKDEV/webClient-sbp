import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './chantier-index/chantier-index.component';
import { ShowComponent } from './chantier-details/chantier-details.component';
import { ShowComponent as FactureShowComponent } from './../factures/facture-details/show.component';
import { ShowComponent as FicheInterventionShowComponent } from './../fiche-intervention/fiche-intervention-details/show.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: IndexComponent,
      data: {
        title: 'Chantier'
      }
    },
    {
      path: 'detail/:id',
      component: ShowComponent,
      data: {
        title: 'Détails chantier'
      }
    },
    {
      path: 'detail/:idChantier/facture/:id',
      component: FactureShowComponent,
    },
    {
      path: 'detail/:idChantier/ficheintervention/:id',
      component: FicheInterventionShowComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChantierRoutingModule { }

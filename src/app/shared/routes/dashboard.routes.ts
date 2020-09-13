import { Routes } from '@angular/router';
//FactureRoutingModule
export const FIXED_NAVBAR_FOOTER_ROUTES: Routes = [
    {
        path: 'chantiers',
        loadChildren: './pages/chantier/chantier.module#ChantierModule'
    },
    {
        path: 'factures',
        loadChildren: './pages/factures/factures.module#FacturesModule'
    },
    {
        path: 'ficheintervention',
        loadChildren: './pages/fiche-intervention/fiche-intervention.module#FicheInterventionsModule'
    }
];
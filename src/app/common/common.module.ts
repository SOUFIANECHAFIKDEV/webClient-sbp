import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';


import { RechercheAvanceeComponent } from './recherche-avancee/recherche-avancee.component';
import { ShowHideTableColumnsComponent } from './show-hide-table-columns/show-hide-table-columns.component';
import { CustomLoaderComponent } from './custom-loader/custom-loader.component';


import { GetNameOfUserByIdPipe } from './Pipes/get-name-of-user-by-id.pipe';
import { GetNameOfFournisseurByIdPipe } from './Pipes/get-name-of-fournisseur-by-id.pipe';
import { GetNameOfGroupePipe } from './Pipes/get-name-of-groupe.pipe';
import { RoudingNumberPipe } from './Pipes/rounding-number.pipe';

import { UtilisateurService } from '../services/users/user.service';
import { FournisseurService } from '../services/fournisseur/fournisseur.service';
import { ClientService } from '../services/client/client.service';
import { ProduitService } from '../services/produit/produit.service';
import { GroupesService } from 'app/services/groupe/groupe.service';

import { Historique } from 'app/Models/Entities/Historique';
import { ActionHistorique } from '../Enums/ActionHistorique.Enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GetUserProfileLibelle } from './Pipes/get-user-profile-libelle.pipe';
import { GetImageBase64ByName } from './Pipes/get-image-base64-by-name.pipe';
import { TruncatePipe } from './Pipes/truncate.pipe';
import { ShowCurrencyPipe } from './Pipes/show-currency.pipe';
import { RoudingNumberInputPipe } from './Pipes/rounding-number-input.pipe';
import { PrixParFournisseurComponent } from './prix-par-fournisseur/prix-par-fournisseur.component';
import { ModalImageComponent } from './modal-image/modal-image.component';

import { PainationComponent } from './paination/paination.component';


import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FolderComponent } from './folder/folder.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PortesComponent } from './portes/portes.component';
//import { NbTreeGridModule, NbTreeGridService } from '@nebular/theme';
import { AngularTreeGridModule } from 'angular-tree-grid';

import { LabelService } from 'app/services/labels/labels.service';
import { GetNameOfChantierPipe } from './Pipes/get-name-of-chantier.pipe';
import { ArticlesMinimalisteComponent } from './articles-minimaliste/articles-minimaliste.component';
import { InputFormatDirective } from './directives/input-format.directive';

import { FicheInterventionService } from 'app/services/ficheIntervention/fiche-intervention.service';
import { CalendarModule } from 'app/custom-module/primeng/primeng';
// import { FullCalendarModule } from 'ng-fullcalendar';
import { FactureService } from 'app/services/facture/facture.service';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { ChoixChantierComponent } from './choix-chantier/choix-chantier.component';
import { OrderListFacturePaiementPipe } from './Pipes/order-list-facture-paiement.pipe';
import { RestePayerPipe } from './Pipes/reste-payer.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/common/', '.json');
}

@NgModule({
  exports: [

    ShowHideTableColumnsComponent,
    GetNameOfUserByIdPipe,
    GetNameOfFournisseurByIdPipe,
    CustomLoaderComponent,


    ModalImageComponent,
    PainationComponent,
    PrixParFournisseurComponent,
    GetNameOfFournisseurByIdPipe,
    GetNameOfGroupePipe,
    ShowCurrencyPipe,
    GetNameOfChantierPipe,
    TruncatePipe,
    GetImageBase64ByName,
    RoudingNumberPipe,
    RoudingNumberInputPipe,
    GetUserProfileLibelle,
    RechercheAvanceeComponent,
    FolderComponent,

    // SelectProduitComponent,
    // SelectLotComponent,
    // ProduitFormComponent,
    PortesComponent,
    ArticlesMinimalisteComponent,
    InputFormatDirective,
    ChoixChantierComponent,
    OrderListFacturePaiementPipe,
    RestePayerPipe,

  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    DataTablesModule,
    InfiniteScrollModule,
    ShowHidePasswordModule,
    AngularTreeGridModule,
    AngularEditorModule,
    PdfViewerModule,
    CalendarModule,
    FullCalendarModule,

  ],
  declarations: [
    ShowHideTableColumnsComponent,
    GetNameOfUserByIdPipe,
    CustomLoaderComponent,

    ModalImageComponent,
    PainationComponent,
    PrixParFournisseurComponent,

    GetNameOfFournisseurByIdPipe,
    GetNameOfFournisseurByIdPipe,
    GetNameOfGroupePipe,
    ShowCurrencyPipe,
    GetNameOfChantierPipe,
    TruncatePipe,
    GetImageBase64ByName,
    RoudingNumberPipe,
    RoudingNumberInputPipe,
    GetUserProfileLibelle,
    RechercheAvanceeComponent,
    FolderComponent,


    // SelectProduitComponent,
    // SelectLotComponent,
    // ProduitFormComponent,
    PortesComponent,
    ArticlesMinimalisteComponent,
    InputFormatDirective,
    ChoixChantierComponent,
    OrderListFacturePaiementPipe,
    RestePayerPipe,
  ],
  providers: [
    UtilisateurService,
    Historique,
    ActionHistorique,
    FournisseurService,
    ClientService,
    ProduitService,
    GroupesService,
    LabelService,
    FicheInterventionService,
    FactureService,
    // NbTreeGridService,
  ],
})
export class CommonModules { }

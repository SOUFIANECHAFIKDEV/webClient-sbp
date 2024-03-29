// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModules } from 'app/common/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, SplitButtonModule } from 'app/custom-module/primeng/primeng';
import { DataTablesModule } from 'angular-datatables';

// Routing
import { FacturesRoutingModule } from './factures-routing.module';

// Components
import { IndexComponent } from './facture-index/index.component';
import { ShowComponent } from './facture-details/show.component';
import { InformationComponent } from './facture-details/information/information.component';
import { PaiementComponent } from './facture-details/paiement/paiement.component';

// Services
import { PreviousRouteService } from 'app/services/previous-route/previous-route.service';
import { FactureService } from 'app/services/facture/facture.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { ClientService } from 'app/services/client/client.service';

import { TableArticleModule } from 'app/common/table-article/table-article.module';
import { ParameteresService } from 'app/services/parameteres/parameteres.service';
import { FileManagerService } from 'app/services/fileManager/file-manager.service';
import { FicheInterventionService } from 'app/services/ficheIntervention/fiche-intervention.service';
import { ModereglementService } from 'app/services/modereglement/modereglement.service';
import { ParametrageCompteService } from 'app/services/parametragecompte/parametrage-compte.service';
import { PaiementService } from 'app/services/paiement/paiement.service';
import { TableArticleSituationModule } from 'app/common/tableArticleSituation/table-article-situation.module';
import { TableArticleFactureAcompteModule } from 'app/common/table-article-facture-acompte/table-article-facture-acompte.module';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/factures/', '.json');
}

@NgModule({
  declarations: [
    IndexComponent,
    ShowComponent,
    InformationComponent,
    PaiementComponent
  ],
  exports: [
    IndexComponent,
    ShowComponent,
    InformationComponent,
    PaiementComponent
  ],
  imports: [
    CommonModule,
    FacturesRoutingModule,
    CommonModules,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule,
    CalendarModule,
    DataTablesModule,
    SplitButtonModule,
    InfiniteScrollModule,
    AngularEditorModule,
    TableArticleModule,
    TableArticleSituationModule,
    TableArticleFactureAcompteModule,

  ],
  providers: [
    PreviousRouteService,
    FactureService,
    FileManagerService,
    ChantierService,
    ClientService,
    FicheInterventionService,
    ParameteresService,
    ModereglementService,
    ParametrageCompteService,
    PaiementService
  ],
})
export class FacturesModule { }

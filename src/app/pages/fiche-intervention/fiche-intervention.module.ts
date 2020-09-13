// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModules } from 'app/common/common.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, SplitButtonModule } from 'app/custom-module/primeng/primeng';
import { DataTablesModule } from 'angular-datatables';

// Routing
import { FicheInterventionsRoutingModule } from './fiche-intervention-routing';

// Components
import { IndexComponent } from './fiche-intervention-index/index.component';
import { ShowComponent } from './fiche-intervention-details/show.component';
import { InformationsComponent } from './fiche-intervention-details/informations/informations.component';


// Services
import { PreviousRouteService } from 'app/services/previous-route/previous-route.service';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { ClientService } from 'app/services/client/client.service';

import { TableArticleModule } from 'app/common/table-article/table-article.module';
import { ParameteresService } from 'app/services/parameteres/parameteres.service';
import { FileManagerService } from 'app/services/fileManager/file-manager.service';
import { FicheInterventionService } from 'app/services/ficheIntervention/fiche-intervention.service';
import { ModereglementService } from 'app/services/modereglement/modereglement.service';
import { ParametrageCompteService } from 'app/services/parametragecompte/parametrage-compte.service';

import { ChantierModule } from '../chantier/chantier.module';
import { SelectUserModule } from 'app/common/select-user/select-user.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TableArticleSituationModule } from 'app/common/tableArticleSituation/table-article-situation.module';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ficheintervention/', '.json');
}

@NgModule({
  declarations: [
    IndexComponent,
    ShowComponent,
    InformationsComponent,

  ],
  exports: [
    IndexComponent,
    ShowComponent,
    InformationsComponent,

  ],
  imports: [
    CommonModule,
    FicheInterventionsRoutingModule,
    NgSelectModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
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
    SelectUserModule,
    CommonModules,
    TableArticleSituationModule
  ],
  providers: [
    PreviousRouteService,
    FileManagerService,
    ChantierService,
    ClientService,
    FicheInterventionService,
    ParameteresService,
    ModereglementService,
    ParametrageCompteService,

  ],
})
export class FicheInterventionsModule { }

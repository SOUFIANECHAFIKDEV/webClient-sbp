import { Component, OnInit } from '@angular/core';
import { FicheInterventionService } from 'app/services/ficheIntervention/fiche-intervention.service';
import { FicheIntervention } from 'app/Models/Entities/FicheIntervention';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { Historique } from 'app/Models/Entities/Historique';
import { Client } from 'app/Models/Entities/Client';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { Chantier } from 'app/Models/Entities/Chantier';
import { ClientService } from 'app/services/client/client.service';

import { Memo } from 'app/Models/Entities/Memo';
import { PieceJoin } from 'app/Models/Entities/PieceJoint';
import { FileManagerService } from 'app/services/fileManager/file-manager.service';
import { FileManagerModel } from 'app/Models/FileManagerModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem } from 'app/custom-module/primeng/api';
import { ParameteresService } from 'app/services/parameteres/parameteres.service';
import { TypeParametrage } from 'app/Enums/TypeParametrage.Enum';
import { TypeNumerotation } from 'app/Enums/TypeNumerotation.Enum';
import { ActionHistorique } from 'app/Enums/ActionHistorique.Enum';
import { UtilisateurService } from 'app/services/users/user.service';
import { InterventionTechnicien } from 'app/Models/Entities/InterventionTechnicien';
import { LoginService } from 'app/services/login/login.service';
import { StatutFicheIntervention } from 'app/Enums/StatutFicheIntervention.enum';
import { User } from 'app/Models/Entities/User';
import { SendMailParams } from 'app/Models/SendMailParams';
import { UserProfile } from 'app/Enums/user-profile.enum';

declare var toastr: any;
export declare var swal: any;

declare var jQuery: any;
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  ficheIntervention: FicheIntervention = new FicheIntervention();
  historique: Historique = new Historique();
  //historique: Historique[];
  client: Client;
  adresseFacturation: string;
  chantiers: Chantier[] = [];
  memos: Memo[] = [];
  processIsStarting: boolean = false;

  loading = true;
  id;
  articles = [];
  statutFicheIntervention: typeof StatutFicheIntervention = StatutFicheIntervention;
  articlesInfo: any = {};
  statuts: { id: number; label: string; color: string }[];
  processing: boolean = false;
  isAdmin = true;

  constructor(
    private ficheInterventionService: FicheInterventionService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private chantierService: ChantierService,
    private clientService: ClientService,
    private fileManagerService: FileManagerService,
    private paramteresService: ParameteresService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.processing = true;
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);

    this.route.params.subscribe(async params => {
      this.id = params['id'];

      this.ficheIntervention = await this.getIntervention(params['id']);
      (this.ficheIntervention);
      this.historique = JSON.parse(this.ficheIntervention.historique);
      await this.getChantiers('');
      this.client = await this.loadChantierInformation(this.ficheIntervention.idChantier);
      this.init(this.id);
      this.processing = false;
    });

    this.translate
      .get('statuts')
      .subscribe((statuts: { id: number; label: string; color: string }[]) => {
        this.statuts = statuts;
      });
    this.isAdmin = (this.loginService.getUser().idProfile == UserProfile.admin);

  }

  async init(id) {
    this.ficheIntervention = await this.getIntervention(id);
    this.historique = JSON.parse(this.ficheIntervention.historique);
    await this.getChantiers('');
    //this.ficheIntervention.idChantier.toString();
    this.client = await this.loadChantierInformation(this.ficheIntervention.idChantier);
    this.memos = this.ficheIntervention.memos
      ? (JSON.parse(this.ficheIntervention.memos) as Memo[])
      : [];
  }

  getIntervention(id): Promise<FicheIntervention> {
    return new Promise((resolve, reject) => {
      this.ficheInterventionService.Get(id).subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.translate.get('errors').subscribe(text => {
            toastr.warning(text.serveur, '', {
              positionClass: 'toast-top-center',
              containerId: 'toast-top-center',
            });
          });
        }
      );
    });
  }

  loadChantierInformation(idChantier): Promise<any> {
    return new Promise(async (reslove, reject) => {
      const chantier: Chantier = this.chantiers.filter(c => c.id == idChantier)[0];
      const { idClient } = chantier;
      const client = await this.getclientById(idClient);
      reslove(client);
    });
  }

  getChantiers(search): Promise<void> {
    return new Promise((reslove, reject) => {
      this.chantierService
        .GetAll(search, 1, AppSettings.NBR_ITEM_PER_PAGE, 'nom', 'asc')
        .subscribe(async res => {
          this.chantiers = res.list;
          reslove();
        });
    });
  }

  getclientById(idClient): Promise<Client> {
    return new Promise((resolve, reject) => {
      this.clientService.Get(idClient).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  // Generate pdf
  generatePDF() {
    ;
    this.loading = true;
    //this.ficheInterventionService.generatePDF(this.id).subscribe(
    this.ficheInterventionService.generatePDF(this.id).subscribe(
      res => {
        ;
        // Get time stamp for fileName.
        var stamp = new Date().getTime();

        // file type
        var fileType = 'application/pdf';

        // file extension
        var extension = 'pdf';

        AppSettings.downloadBase64(',' + res, 'FI_' + stamp + '.' + extension, fileType, extension);
        this.loading = false;
      },
      err => {
        // alert('...');
        this.translate.get('errors').subscribe(text => {
          toastr.warning('', text.serveur, {
            positionClass: 'toast-top-center',
            containerId: 'toast-top-center',
          });
        });
      }
    );
  }

  formSendEmail = new FormGroup({
    emailTo: new FormControl('', Validators.required),
    object: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
  });
  items: MenuItem[] = [];
  ficheInterventionEmail: any[] = [];
  emails: any[];

  actionHistorique: ActionHistorique = new ActionHistorique();


  getParametrageIntervention(dataintervention) {
    this.ficheInterventionService
      .getParametrageFicheIntervention(TypeParametrage.parametrageDevis)
      .subscribe((res: any) => {
        let data = JSON.parse(res.contenu);
        this.formSendEmail.setValue({
          emailTo: dataintervention.chantier.client.email,
          object: data.sujetmail_interventions,
          contents: data.contenumail_interventions,
        });

      });
  }



  revenir() {
    this.route.params.subscribe(async params => {
      const idChantier = params['idChantier'];
      let url = idChantier != null ? `chantiers/detail/${idChantier}` : `ficheintervention`;
      this.router.navigate([url]);
    });

  }

}

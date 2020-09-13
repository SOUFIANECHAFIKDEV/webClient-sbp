import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { FactureService } from 'app/services/facture/facture.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'app/Models/Entities/Facture';
import { StatutFacture } from 'app/Enums/StatutFacture.Enum';
import { Memo } from 'app/Models/Entities/Memo';
import { FileManagerModel } from 'app/Models/FileManagerModel';
import { FileManagerService } from 'app/services/fileManager/file-manager.service';
import { PieceJoin } from 'app/Models/Entities/PieceJoint';
import { MenuItem } from 'app/custom-module/primeng/api';

import { Historique } from 'app/Models/Entities/Historique';
import { ActionHistorique } from 'app/Enums/ActionHistorique.Enum';
import { LoginService } from 'app/services/login/login.service';
import { ICalcule } from 'app/calcule/ICalcule';
import { Calcule } from 'app/calcule/Calcule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FactureReferenceStatut } from 'app/Enums/FactureReferenceStatut.Enum';
import { SendMailParams } from 'app/Models/SendMailParams';
import { ClientService } from 'app/services/client/client.service';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { Client } from 'app/Models/Entities/Client';
import { Chantier } from 'app/Models/Entities/Chantier';

import { Avoir } from 'app/Models/Entities/Avoir';

import { ParameteresService } from 'app/services/parameteres/parameteres.service';
import { AvoirService } from 'app/services/avoir/avoir.service';
import { TypeNumerotation } from 'app/Enums/TypeNumerotation.Enum';
import { PrestationsModule, LotProduits } from 'app/Models/Entities/Lots';

declare var toastr: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  id;
  facture: Facture = new Facture();
  historique;
  loading = false;
  calcule: ICalcule = new Calcule();

  statutFacture: typeof StatutFacture = StatutFacture;
  memos: Memo[] = [];
  processIsStarting: boolean = false;
  items: MenuItem[] = [];
  actionHistorique: ActionHistorique = new ActionHistorique();
  emails: any[];
  client: Client;
  adresseFacturation: string;
  chantiers: Chantier[] = [];
  statuts: { id: number; label: string; color: string }[];
  articles = [];
  articlesInfo: any = {};
  typeNumerotation: typeof TypeNumerotation = TypeNumerotation;
  processing: boolean = false;
  idChantier: number = null;

  constructor(
    private translate: TranslateService,
    private factureService: FactureService,
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private router: Router,
    private chantierService: ChantierService,
    private clientService: ClientService,
    private loginService: LoginService,
    private paramteresService: ParameteresService,
    private avoirService: AvoirService,
  ) { }

  ngOnInit() {
    this.processing = true;
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
    this.translate
      .get('statuts')
      .subscribe((statuts: { id: number; label: string; color: string }[]) => {
        this.statuts = statuts;
      });
    this.route.params.subscribe(async params => {
      this.id = params['id'];
      this.translate
        .get('statuts')
        .subscribe((statuts: { id: number; label: string; color: string }[]) => {
          this.statuts = statuts;
        });

      await this.init(this.id);
      this.getChantiers('');


    });


  }


  async init(id) {
    this.facture = await this.getFacture(id);
    this.historique = JSON.parse(this.facture.historique);
    await this.getChantiers('');
    if (this.facture.idChantier != null) {
      this.client = await this.loadChantierInformation(this.facture.idChantier);
    }

    this.processing = false;
  }

  getFacture(id): Promise<Facture> {
    return new Promise((resolve, reject) => {
      this.factureService.Get(id).subscribe(
        res => {
          this.facture = res;
          this.articles = JSON.parse(res.prestations);
          this.historique = JSON.parse(this.facture.historique) as Historique[];

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
        res => { resolve(res); },
        err => { reject(err); });
    });
  }


  // Generate pdf
  generatePDF() {
    this.loading = true;
    this.factureService.generatePDF(this.id).subscribe(res => {
      // Get time stamp for fileName.
      var stamp = new Date().getTime();

      // file type
      var fileType = 'application/pdf';

      // file extension
      var extension = 'pdf';

      AppSettings.downloadBase64(',' + res, 'FA_' + stamp + '.' + extension, fileType, extension);
      this.loading = false;
    });
  }


  revenir() {
    this.route.params.subscribe(async params => {
      const idChantier = params['idChantier'];
      let url = idChantier != null ? `chantiers/detail/${idChantier}` : `factures`;
      this.router.navigate([url]);
    });

  }

  navigateToFactureList(): void {

    let url = this.idChantier != null ? `/chantiers/${this.idChantier}/documents/devis` : `/devis`;
    this.router.navigate([url]);
  }
}

import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { FicheIntervention } from 'app/Models/Entities/FicheIntervention';
import { Client } from 'app/Models/Entities/Client';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { DOCUMENT } from '@angular/common';
import { User } from 'app/Models/Entities/User';
import { StatutFicheIntervention } from 'app/Enums/StatutFicheIntervention.enum';
import { TranslateService } from '@ngx-translate/core';
import { FicheInterventionService } from 'app/services/ficheIntervention/fiche-intervention.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { Adresse } from 'app/Models/Entities/Adresse';
import { StatutFacture } from 'app/Enums/StatutFacture.Enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ficheIntervention-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit, OnChanges {
  @Input('ficheIntervention') ficheIntervention: FicheIntervention;
  @Input('client') client: Client;

  adresseFacturation: Adresse;
  usersToDispaly
  techniciens: User[] = [];
  prestations = [];
  // statutDevis: typeof StatutDevis = StatutDevis;
  statutficheIntervention: typeof StatutFicheIntervention = StatutFicheIntervention
  statutFacture: typeof StatutFacture = StatutFacture
  labels: any;
  statuts: { id: number, label: string, color: string }[];
  designation
  idChantier
  emitter

  constructor(private ficheInterventionService: FicheInterventionService,
    private route: ActivatedRoute,
    private router: Router, private chantierService: ChantierService, private translate: TranslateService, @Inject(DOCUMENT) private document: any) {
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
    this.translate.get("labels").subscribe(text => {
      this.labels = text;
    });
  }


  ngOnInit() {
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
    this.translate.get("statuts").subscribe((statuts: { id: number, label: string, color: string }[]) => {
      this.statuts = statuts;
    });


    //this.idChantier = await this.getIdChantier();
  }


  async ngOnChanges() {
    debugger
    console.log("this.ficheIntervention", this.ficheIntervention)
    if (this.ficheIntervention != undefined) {
      try {
        this.adresseFacturation = JSON.parse(this.ficheIntervention.adresseIntervention);
      } catch (ex) { }

      this.techniciens = this.ficheIntervention.interventionTechnicien.map(res => {
        return res.idTechnicienNavigation;
      });


      this.prestations = JSON.parse(JSON.parse(this.ficheIntervention.prestations).prestation);

    }
    this.getLabelleByStatut(this.ficheIntervention.status);
    this.idChantier = await this.getIdChantier();
  }



  getLabelleByStatut(statut) {


    switch (statut) {
      case this.statutficheIntervention.Brouillon:
        return this.labels.brouillon;
        break;
      case this.statutficheIntervention.Annulee:
        return this.labels.annulee;
        break;
      case this.statutficheIntervention.Planifiee:
        return this.labels.planifiee;
        break;
      case this.statutficheIntervention.Realisee:
        return this.labels.realisee;
        break;
      case this.statutficheIntervention.Facturee:
        return this.labels.facturee;
        break;
      // 
    }


  }

  getIdChantier(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => resolve(params["idChantier"]))
    });
  }

  navigateToFactureDetail(idfacture: number) {
    console.log("idfacture", idfacture)
    console.log("idChantier", this.idChantier)
    //http://localhost:4202/chantiers/detail/97/facture/323
    let url = this.idChantier != null ? `/chantiers/detail/${this.idChantier}/facture/${idfacture}` : `factures/detail/${idfacture}`;
    this.router.navigate([url]);
  }

}



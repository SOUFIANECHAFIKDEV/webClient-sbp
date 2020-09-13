import { Component, OnInit, Input } from '@angular/core';
import { Facture } from 'app/Models/Entities/Facture';
import { Prestation } from 'app/Models/Entities/Prestation';
import { StatutFacture } from 'app/Enums/StatutFacture.Enum';
import { Client } from 'app/Models/Entities/Client';
import { Adresse } from 'app/Models/Entities/Adresse';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { TypeFacture } from 'app/Enums/TypeFacture.enum';
import { StatutDevis } from 'app/Enums/StatutDevis';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'facture-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {

  @Input('facture') facture: Facture;

  @Input('client') client: Client;

  @Input('articles') articles = [];
  typeFacture: typeof TypeFacture = TypeFacture
  statutFacture: typeof StatutFacture = StatutFacture;

  statutDevis: typeof StatutDevis = StatutDevis
  adresseFacturation: Adresse
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
  }
  idChantier
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.idChantier = await this.getIdChantier();
  }

  getAdresseDesignation(data): string {
    try {
      const adresses: Adresse[] = JSON.parse(data)
      const adresse = adresses.filter(x => x.default);
      return adresse.length != 0 ? adresse[0].designation : '';
    } catch (err) {
      return '';
    }
  }
  getIdChantier(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => resolve(params["idChantier"]))
    });
  }

  navigateToFicheInterventionDetail(idficheIntervention: number) {
    //http://localhost:4202/chantiers/detail/97/facture/323
    let url = this.idChantier != null ? `/chantiers/detail/${this.idChantier}/ficheintervention/${idficheIntervention}` : `ficheintervention/detail/${idficheIntervention}`;
    this.router.navigate([url]);
  }


}

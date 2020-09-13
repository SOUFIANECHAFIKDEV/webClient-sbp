import { Component, OnInit, Input } from '@angular/core';
import { Chantier } from 'app/Models/Entities/Chantier';
import { TranslateService } from "@ngx-translate/core";
import { Client } from 'app/Models/Entities/Client';
import { StatutChantier } from 'app/Enums/StatutChantier.Enum';

@Component({
  selector: 'chantier-information',
  templateUrl: './chantier-information.component.html',
  styleUrls: ['./chantier-information.component.scss']
})
export class ChantierComponent implements OnInit {
  @Input('chantier') chantier: Chantier;
  statuts: { id: number, label: string, color: string }[];
  client: Client
  statutChantier: typeof StatutChantier = StatutChantier;
  constructor(private translate: TranslateService) { }

  ngOnInit() {

    this.translate.get("statuts").subscribe((statuts: { id: number, label: string, color: string }[]) => {
      this.statuts = statuts;

    });


  }
  ngOnChanges() { }
  getLabelleByStatut(statut): string {
    if (statut == undefined) return;
    let statuts = this.statuts.filter(S => S.id == statut)[0];
    return statuts == undefined ? "" : statuts.label;
  }


  //   deserialzeAdresseTravaux(){
  //     return this.chantier != null ? JSON.parse(this.chantier.adresseTravaux):[]
  //  }


}

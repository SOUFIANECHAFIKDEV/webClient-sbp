import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { Client } from 'app/Models/Entities/Client';
import { ClientService } from 'app/services/client/client.service';
import { Chantier } from 'app/Models/Entities/Chantier';
import { ChantierService } from 'app/services/chantier/chantier.service';

declare var jQuery: any;

@Component({
  selector: 'choix-chantier-popup',
  templateUrl: './choix-chantier.component.html',
  styleUrls: ['./choix-chantier.component.scss']
})
export class ChoixChantierComponent implements OnInit {

  idChantier
  chantiers: Chantier[] = []
  @Output("chantier") chantier = new EventEmitter();
  @Input("id") idPop = "choixChantier"

  constructor(
    private clientService: ClientService,
    private chantierService: ChantierService,
  ) { }

  ngOnInit() {
    this.getChantiers("")
  }

  // Pour récupérer la liste des clients
  getChantiers(search) {
    this.chantierService.GetAll(search, 1, AppSettings.NBR_ITEM_PER_PAGE, "nom", "desc").subscribe((res) => {
      this.chantiers = res.list;
    });
  }

  // Choisir client
  choisirChantier() {
    jQuery("#choixChantier").modal("hide");
    this.chantier.emit(this.idChantier)
    this.idChantier = null;
  }

}

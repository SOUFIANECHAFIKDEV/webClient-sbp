import { Chantier } from "./Chantier";
import { Client } from "./Client";
import { Facture } from "./Facture";

import { Acompte } from "./Acompte";

export class Devis {
  id: number
  reference: string;
  dateCreation: Date;
  idChantier: number;
  note: string;
  total: number;
  status: number;
  objet: string;
  prestation: string;
  historique: string;
  remise: number;
  typeRemise: string;
  totalHt: number;
  prorata: number;
  puc: number;
  tva: string;
  conditionReglement: string;
  devisExel: string;
  retenueGarantie: number;
  adresseFacturation: string;
  adresseIntervention: string;
  tvaGlobal: number;
  emails: string;
  chantier: Chantier;
  client: Client;
  facture: Facture[];
  acompte: Acompte[];
  situation:string;
}

export class FactureSituationbodyRequest {
  idDevis: number;
  situations: FactureSituationDevis;
  facture: Facture
};


export class FactureSituationDevis {
  idFacture: number;
  pourcentage: number;
  resteAPayer: number
};

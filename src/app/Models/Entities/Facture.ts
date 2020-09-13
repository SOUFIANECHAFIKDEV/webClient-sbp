
import { Chantier } from './Chantier';
import { Avoir } from './Avoir';
import { FicheIntervention } from './FicheIntervention';
import { FacturePaiement } from './FacturePaiement';
import { Devis } from './Devis';

export class Facture {
  id: number;
  reference: string;
  dateCreation: Date;
  dateEcheance: Date;
  prestations: string;
  status: number;
  remise: number;
  typeRemise: string;
  total: number;
  historique: string;
  memos: string;
  comptabilise: number;
  note: string;
  conditionRegelement: string;
  emails: string;
  compteur: number;
  object: string;
  idChantier: number;
  chantier: Chantier;
  facturePaiements: FacturePaiement[];
  ficheInterventions: FicheIntervention[];
  idDevis: number;
  devis: Devis;
  avoirs: Avoir[];
  totalHt: number;
  tva: string;
  tvaGlobal: number;
  prorata: number;
  puc: number;
  retenueGarantie: number;
  typeFacture: number;
  infoClient: any;
  idClient: number;
  //virtual
  pourcentage: number;
  restePayer: number;
  delaiGarantie: number;
  statusGarantie: number;
}

export class infoClientModel {
  adresseFacturation: any
  nom: String
  codeClient: String
}

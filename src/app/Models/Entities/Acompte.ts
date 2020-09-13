import { Modereglement } from "./Modereglement";
import { ParametrageCompte } from "./ParametrageCompte";
import { Devis } from "./Devis";
import { Facture } from "./Facture";


export class Acompte {
  id: number;
  comptabilise: number;
  type: number;
  montant: number;
  montantHt: number;
  pourcentage: number;
  idCaisse: number;
  dateAcompte: Date
  idModePaiement: number;
  description: string;
  historique: string;
  idSociete: number
  idAvoir: number
  // factureAcomptes: FactureAcompte[];
  modeReglement: Modereglement
  parametrageCompte: ParametrageCompte
  idDevis: number
  devis: Devis
  idFacture: number
  facture: Facture
  // avoir: Avoir
}
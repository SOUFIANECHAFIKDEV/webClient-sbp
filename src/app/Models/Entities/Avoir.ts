import { Client } from "./Client";
import { Facture } from "./Facture";
import { Chantier } from "./Chantier";
import { Paiement } from "./Paiement";
//import { Paiement } from "./Paiement";


export class Avoir {
    id: number;
    reference: string;
    dateCreation: Date
    dateEcheance: Date;
    prestations: string
    status: number
    remise: number
    typeRemise: string
    total: number
    historique: string
    memos: string
    comptabilise: number
    note: string;
    conditionRegelement: string
    object: string;

    idFacture: number
    idChantier: number
    chantier: Chantier;
    facture: Facture
    paiements: Paiement[]
    totalHt: number;
    infoClient: any;
    idClient: number;

    compteur: number

    tva: string;
    tvaGlobal: number;
    prorata: number;
    puc: number;
    retenueGarantie: number;
}
export class infoClientModel {
    adresseFacturation: any
    nom: String
    codeClient: String
}
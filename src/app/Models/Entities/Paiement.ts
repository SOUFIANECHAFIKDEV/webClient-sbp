// import { FacturePaiement } from "./FacturePaiement";
import { Modereglement } from "./Modereglement";
import { ParametrageCompte } from "./ParametrageCompte";
import { Avoir } from "./Avoir";
import { FacturePaiement } from "./FacturePaiement";

export class Paiement {
    id: number;
    comptabilise: number;
    type: number;
    montant: number;
    idCaisse: number;
    datePaiement: Date
    idModePaiement: number;
    description: string;
    historique: string;
    idSociete: number
    idAvoir: number
    facturePaiements: FacturePaiement[];
    modeReglement: Modereglement
    parametrageCompte: ParametrageCompte
    avoir: Avoir
}
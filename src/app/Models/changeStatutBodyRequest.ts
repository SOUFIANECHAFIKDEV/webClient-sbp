import { StatutChantier } from "app/Enums/StatutChantier.Enum";
import { StatutDevis } from "app/Enums/StatutDevis";

export class ChangeStatutBodyRequest {
    idChantier:number;
    statutChantier:StatutChantier;
}


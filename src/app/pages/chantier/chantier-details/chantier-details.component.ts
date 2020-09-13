import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Historique } from 'app/Models/Entities/Historique';
import { AppSettings } from 'app/app-settings/app-settings';
import { TranslateService } from '@ngx-translate/core';
import { Chantier } from 'app/Models/Entities/Chantier';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { StatutChantier } from 'app/Enums/StatutChantier.Enum';

declare var jQuery: any;
declare var swal: any;
declare var toastr: any;
@Component({
    selector: 'app-chantier-details',
    templateUrl: './chantier-details.component.html',
    styleUrls: ['./chantier-details.component.scss']
})
export class ShowComponent implements OnInit {

    chantier: Chantier;
    historique: Historique[] = [];
    formType;
    id: number;
    statutChantier: typeof StatutChantier = StatutChantier;
    statuts: { id: number, label: string, color: string }[];
    processing: boolean = false;
    constructor(
        private chantierService: ChantierService,
        private route: ActivatedRoute,
        private translate: TranslateService) { }

    ngOnInit() {

        this.statutChantier.EnEtude
        this.translate.setDefaultLang(AppSettings.lang);
        this.translate.use(AppSettings.lang);
        this.route.params.subscribe(async params => {

            this.processing = true;
            this.id = params["id"];
            this.chantier = await this.getChantier(params["id"]);
            this.historique = JSON.parse(this.chantier.historique);
            this.processing = false;
            (this.historique)
        });
        this.translate.get("statuts").subscribe((statuts: { id: number, label: string, color: string }[]) => {
            this.statuts = statuts;
        });
    }
    getChantier(id: number): Promise<Chantier> {
        return new Promise((resolve, reject) => {
            this.chantierService.Get(id).subscribe(chantier => {
                resolve(chantier);
            }, err => {
                reject(err);
            });
        });
    }
    public formConfig = {
        type: null,
        defaultData: null
    }

    openEditForm() {
        this.setformConfig(this.chantier, this.formType.update);
        jQuery("#Model").modal("show");
    }

    setformConfig(defaultData, type) {
        this.formConfig.defaultData = defaultData;
        this.formConfig.type = type;
    }

    update(chantier: Chantier) {

        this.chantierService.Update(chantier.id, chantier).subscribe(res => {
            this.translate.get("update").subscribe(async text => {
                this.chantier = await this.getChantier(this.id);
                this.historique = JSON.parse(this.chantier.historique);
                jQuery("#Model").modal("hide");
                toastr.success(text.msg, text.title, { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
            });
        }, err => {
            this.translate.get("update").subscribe(text => {
                toastr.danger(text.msg, text.title, { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
            });
        });
    }
    getLabelleByStatut(statut): string {
        if (statut == undefined) return;
        let statuts = this.statuts.filter(S => S.id == statut)[0];
        return statuts == undefined ? "" : statuts.label;
    }

    /** changer le statut du chantier  */
    changeStatutChantier(changeTostatut: StatutChantier) {

        this.translate.get(this.getTransalteLocationRequest(changeTostatut)).subscribe(text => {
            swal({
                title: `${text.title} " ${this.chantier.nom} "`,
                text: text.question,
                icon: "warning",
                buttons: {
                    cancel: {
                        text: text.cancel,
                        value: null,
                        visible: true,
                        className: "",
                        closeModal: false
                    },
                    confirm: {
                        text: text.confirm,
                        value: true,
                        visible: true,
                        className: "",
                        closeModal: false
                    }
                }
            }).then(isConfirm => {
                if (isConfirm) {
                    this.chantierService.changeStatut({
                        idChantier: this.chantier.id, statutChantier: changeTostatut
                    }).subscribe(async (res: boolean) => {
                        if (res) {
                            swal(text.success, "", "success");
                            this.chantier = await this.getChantier(this.id);
                            this.historique = JSON.parse(this.chantier.historique);
                        } else {
                            swal(text.error, "", "error");
                        }
                    }, err => {
                        swal(text.error, "", "error");
                    });
                } else {
                    swal(text.cancel, "", "error");
                }
            });
        });
    }

    /**
     * @summary fonction générique s'utiliser dans la fonction du changement du statut d'un chantier 
     * @todo déterminer la requête pour récupérer la traduction à partirdu ficher json de traduction
     * @param statut le statut du chantier qui nous voulons récupérer leur traduction
     */
    getTransalteLocationRequest(statut: StatutChantier): string {
        (statut)

        let StatusLabel: string = this.statutChantier[statut].toLowerCase();
        (StatusLabel)
        return `changeStatut.${StatusLabel}`;

    }
}

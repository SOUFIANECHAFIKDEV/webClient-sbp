import { Component, OnInit, ViewChild } from "@angular/core";
import { Chantier } from "app/Models/Entities/Chantier";
import { ChantierService } from "app/services/chantier/chantier.service";
import { ActionHistorique } from "app/Enums/ActionHistorique.Enum";
import { AppSettings } from "app/app-settings/app-settings";
import { TranslateService } from "@ngx-translate/core";
import { StatutChantier } from "app/Enums/StatutChantier.Enum";
import { ChantierListModel } from "app/Models/ChantierListModel";
import { LoginService } from "app/services/login/login.service";
import { UserProfile } from "app/Enums/user-profile.enum";
import { User } from "app/Models/Entities/User";
import { ClientService } from "app/services/client/client.service";
import { Client } from "app/Models/Entities/Client";
import { NgSelectComponent } from "@ng-select/ng-select";
import { Router } from "@angular/router";

declare var jQuery: any;
declare var swal: any;
declare var toastr: any;

@Component({
    selector: "app-chantier-index",
    templateUrl: "./chantier-index.component.html",
    styleUrls: ["./chantier-index.component.scss"]
})
export class IndexComponent implements OnInit {
    formType
    IFormType;
    formConfig = {
        type: null,
        defaultData: null
    }
    actionHistorique: ActionHistorique = new ActionHistorique();
    serach = '';
    pageNumber = 1;
    pageSize = 12;
    pageSizes = [12, 24, 36, 48];
    statut: StatutChantier = null;
    statutChantier: typeof StatutChantier = StatutChantier;
    chantiers: ChantierListModel;
    statuts: { id: number, label: string, color: string }[];
    isAdmin: boolean = true;
    client = null;
    processing: boolean = false;
    listClients: Client[] = null;
    SBP_USER_CLIENT
    @ViewChild('selectClient') selectClient: NgSelectComponent;
    constructor(private chantierService: ChantierService,
        private translate: TranslateService,
        private loginService: LoginService,
        private router: Router,
        private clientService: ClientService) { }

    async ngOnInit() {
        this.translate.setDefaultLang(AppSettings.lang);
        this.translate.use(AppSettings.lang);
        this.getAll();
        this.getUser();
        this.statuts = await this.getTranslationByKey('statuts');
        if (this.statuts[0].id != null) {
            this.statuts.unshift({
                "id": null,
                "label": "Tous",
                "color": ""
            });
        }

    }

    getUser() {
        const user: User = this.loginService.getUser();
        this.isAdmin = user.idProfile == UserProfile.admin;
    }


    setformConfig(defaultData, type) {
        this.formConfig.defaultData = defaultData;
        this.formConfig.type = type;
    }



    getAll() {
        this.processing = true;
        this.SBP_USER_CLIENT = JSON.parse(localStorage.getItem("SBP_client_USER")).idClient;
        this.chantierService.GetAll(this.serach, this.pageNumber, this.pageSize, 'date_creation', 'desc', this.statut, this.SBP_USER_CLIENT).subscribe((res: ChantierListModel) => {
            this.processing = false;
            this.chantiers = res;
        }, err => this.translate.get("errors").subscribe(errors => {
            if (this.processing) {
                this.processing = false;
                toastr.warning(errors.serveur, "", { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
            }
        }));
    }

    chagePageNumber(value) {
        this.pageNumber = value;
        this.getAll();
    }

    changePageSize(value) {
        this.pageSize = value;
        this.getAll();
    }

    OnDelete(id: number) {
        this.translate.get("list.delete").subscribe(text => {
            swal({
                title: text.title,
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
                    this.chantierService.Delete(id).subscribe(res => {
                        if (res) {
                            swal(text.success, "", "success");
                            this.getAll()
                        } else {
                            swal(text.ImpossibleDeSuppression, "", "error");
                        }
                    });
                } else {
                    swal(text.cancel, "", "error");
                }
            });
        });
    }

    OnShow(chantier: Chantier) {
        this.setformConfig(chantier, this.formType.preview);
        jQuery("#Model").modal("show");
    }

    OnEdit(chantier: Chantier) {
        this.setformConfig(chantier, this.formType.update);
        jQuery("#Model").modal("show");
    }

    search() {
        this.getAll();
    }


    getClients() {
        if (this.listClients != null) return;
        this.processing = true;
        this.clientService.GetAll('', 1, AppSettings.MAX_GET_DATA, 'id', 'ASC', null).subscribe(res => {
            // resolve(res.list);
            this.listClients = res.list;
        }, async err => {
            //    reject(err);
            const transaltions = await this.getTranslationByKey('errors');
            toastr.warning(transaltions.serveur, "", { positionClass: 'toast-top-center', containerId: 'toast-top-center' });

        }, () => {
            this.processing = false;
            this.selectClient.isOpen = true;
        });

    }

    // firstLoading: boolean = false;
    // async loadFilterData() {
    //     if (!this.firstLoading) {
    //         this.processing = true;
    //         try {
    //             // = await this.getClients();


    //         } catch (err) {
    //             const transaltions = await this.getTranslationByKey('errors');
    //             toastr.warning(transaltions.serveur, "", { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
    //         }
    //         this.processing = false;
    //         this.firstLoading = true;
    //     }
    // }

    getTranslationByKey(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.translate.get(key).subscribe(translation => {
                resolve(translation);
            });
        });
    }

    /**
* double clique pour passer au details de fiche intervention
*/
    preventSingleClick = false;
    timer: any;

    doubleClick(idChantier) {
        this.preventSingleClick = true;
        clearTimeout(this.timer);
        this.router.navigate(['/chantiers/detail', idChantier]);

    }
}

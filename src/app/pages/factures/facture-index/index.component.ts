import { Component, OnInit, ViewChild, Input, ɵConsole } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { StatutFacture } from 'app/Enums/StatutFacture.Enum';
import { PreviousRouteService } from 'app/services/previous-route/previous-route.service';
import { FactureService } from 'app/services/facture/facture.service';
import { Subject } from 'rxjs';
import { FactureListModel } from 'app/Models/FactureListModel';
import { DataTableDirective } from 'angular-datatables';
// import { StatutComptabilise } from 'app/Enums/StatutComptabilise.Enum';
import { UserProfile } from 'app/Enums/user-profile.enum';
import { LoginService } from 'app/services/login/login.service';
import { ChantierService } from 'app/services/chantier/chantier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture, infoClientModel } from 'app/Models/Entities/Facture';

declare var swal: any;
declare var toastr: any;

@Component({
  selector: 'app-facture-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  factures: FactureListModel;
  dtOptions: DataTables.Settings;
  statutFacture: typeof StatutFacture = StatutFacture;
  dataTablesLang;
  dateLang;
  factureTableColumns: any[];
  listStatus: any = [];
  pageLength = AppSettings.SIZE_PAGE;
  initPage = 0;
  processing: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  checkedColumns: any = [];
  dateMinimal: Date;
  dateMaximal: Date;
  status;
  oldChoices: any;
  i = 0;
  total;
  chantier = null;
  listChantiers: any = [];
  tableColumns: any[];
  //statutComptabilise: typeof StatutComptabilise = StatutComptabilise

  statut
  //@Input('statut') statut;
  @Input('orderBy') orderBy;
  @Input('nameModule') nameModule;
  CallFromOutSide: boolean = false;
  idChantier = null;

  constructor(
    private translate: TranslateService,
    private previousRouteService: PreviousRouteService,
    private factureService: FactureService,
    private chantierService: ChantierService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);

    //
    let transalation = await this.getTranslationByKey('dataTablesFactures');
    this.dataTablesLang = transalation;
    //
    this.translate.get('datePicker').subscribe(text => {
      this.dateLang = text;
    });

    this.tableColumns = await this.setTableColumns();
    this.listStatus = await this.getTranslationForfilterStatut();

    this.getChantierService();

    this.route.params.subscribe(async params => {
      this.idChantier = params['id'];
      this.CallFromOutSide = params['id'] != undefined
    });
  }

  async setTableColumns(): Promise<any[]> {
    const transalation = await this.getTranslationByKey('labels');
    return [transalation.reference, transalation.statut].concat(this.idChantier ? [transalation.action] : [transalation.chantier, transalation.dateCreation, transalation.dateEcheance, transalation.totalTTC, transalation.action]);
  }

  async getTranslationForfilterStatut() {
    try {
      const labels = await this.getTranslationByKey('labels');
      const statut = ['Brouillon', 'Encours', 'Cloture', 'Enretard', 'Annule'];
      const transaltionKeys = ['brouillon', 'encours', 'cloture', 'enretard', 'annulee'];
      return statut.map((element, index) => {
        return { value: StatutFacture[element], name: labels[transaltionKeys[index]] };
      });
    } catch (exception) {
      console.log(exception);
      return [];
    }

  }
  getChantierService() {

    this.chantierService
      .GetAll('', 1, AppSettings.MAX_GET_DATA, 'id', 'ASC', null)
      .subscribe(res => {
        this.listChantiers = res.list;
      });
  }

  GetNameOfChantier(idChantier) {

    const result = (this.listChantiers as any[]).filter(c => c.id == idChantier);
    return result.length > 0 ? result[0].nom : '';
  }

  InitDataTable() {
    this.processing = true;
    // recupérer old paramétere
    this.getOldChoice();
    this.pageLength =
      !this.oldChoices || this.oldChoices.page_length == null
        ? AppSettings.SIZE_PAGE
        : parseInt(this.oldChoices.page_length);
    let order =
      !this.oldChoices || this.oldChoices.sort == null
        ? [[0, 'asc']]
        : [[parseInt(this.oldChoices.sort), this.oldChoices.dir]];

    // Garder pagination
    var previousUrl = this.previousRouteService.getPreviousUrl();
    if (previousUrl.includes('/factures/detail') || previousUrl.includes('/factures/modifier')) {
      if (this.oldChoices && this.oldChoices.start != null) this.initPage = this.oldChoices.start;
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: false,
      displayStart: this.initPage,
      order: order,
      language: this.dataTablesLang,
      columnDefs: [{ orderable: false, targets: 6 }, { orderable: false, targets: 2 }],
      ajax: (dataTablesParameters: any, callback) => {
        setTimeout(() => {
          this.saveChoices(
            dataTablesParameters.length,
            dataTablesParameters.search.value,
            dataTablesParameters.order[0].column,
            dataTablesParameters.order[0].dir,
            dataTablesParameters.start
          );
        }, 1000);
        let SBP_USER_CLIENT = JSON.parse(localStorage.getItem("SBP_client_USER")).idClient;

        this.factureService
          .GetAll(
            dataTablesParameters.search.value,
            dataTablesParameters.start / dataTablesParameters.length + 1,
            dataTablesParameters.length,
            dataTablesParameters.columns[dataTablesParameters.order[0].column].data,
            dataTablesParameters.order[0].dir,
            // this.statut,
            this.statut != null ? [this.statut] : [],
            this.dateMinimal != null
              ? AppSettings.formaterDatetime(this.dateMinimal.toString())
              : null,
            this.dateMaximal != null
              ? AppSettings.formaterDatetime(this.dateMaximal.toString())
              : null,
            // this.statut,
            this.idChantier,
            SBP_USER_CLIENT,
          )
          .subscribe(data => {
            this.factures = data;
            this.GetInitParameters();
            if (this.i == 0) {
              this.total = data.totalItems;
              this.i++;
            }
            if (this.i == 0) {
              this.total = data.totalItems;
              this.i++;
            }
            callback({
              recordsTotal: this.total,
              recordsFiltered: data.totalItems,
              data: [],
            });
            this.processing = false;
          }, err => this.translate.get("errors").subscribe(errors => {
            if (this.processing) {
              this.processing = false;
              toastr.warning(errors.serveur, "", { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
            }
          }));
      },
      columns: [
        { data: 'reference' },
        { data: 'status' },
        { data: 'chantier' },
        { data: 'dateCreation' },
        { data: 'dateEcheance' },
        { data: 'total' },
        { data: 'action' },
      ],
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.GetInitParameters();
      this.InitDataTable();
      this.dtTrigger.next();
      this.rerender();
    }, 500);
    setTimeout(() => {
      this.processing = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      setTimeout(() => {
        this.getOldChoice();
        if (this.oldChoices && this.oldChoices.search != null && this.oldChoices.search != '') {
          var table = $('#factureTable').DataTable();
          table.search(this.oldChoices.search).draw();
        }
      }, 500);
    });
  }

  // getDataTablesTrans() {
  //   this.translate.get('dataTablesFactures').subscribe((text: string) => {
  //     this.dataTablesLang = text;
  //   });
  // }

  SetCheckedColmuns(arr) {
    localStorage.setItem('module_facture_colmuns', JSON.stringify(arr));
  }

  GetInitParameters() {
    let data = JSON.parse(localStorage.getItem('module_facture_colmuns'));
    this.checkedColumns = data == null ? [false, false, false, false, false, false, false] : data;
  }

  saveChoices(length, search, sort, dir, start) {
    localStorage.setItem(
      'module_facture_info',
      JSON.stringify({ page_length: length, search: search, sort: sort, dir: dir, start: start })
    );
  }

  getOldChoice() {
    this.oldChoices = JSON.parse(localStorage.getItem('module_facture_info'));
  }

  indexChangeDateMinimal = 0;
  changeDateMinimal() {
    if (this.dateMinimal != null) {
      this.rerender();
      this.indexChangeDateMinimal = 0;
    } else if (this.indexChangeDateMinimal == 0) {
      this.rerender();
      this.indexChangeDateMinimal++;
    }
  }

  indexChangeDateMaximal = 0;
  changeDateMaximal() {
    if (this.dateMaximal != null) {
      this.rerender();
      this.indexChangeDateMaximal = 0;
    } else if (this.indexChangeDateMaximal == 0) {
      this.rerender();
      this.indexChangeDateMaximal++;
    }
  }

  delete(id) {
    this.translate.get('list.delete').subscribe(text => {
      swal({
        title: text.title,
        text: text.question,
        icon: 'warning',
        buttons: {
          cancel: {
            text: text.cancel,
            value: null,
            visible: true,
            className: '',
            closeModal: true,
          },
          confirm: {
            text: text.confirm,
            value: true,
            visible: true,
            className: '',
            closeModal: true,
          },
        },
      }).then(isConfirm => {
        if (isConfirm) {
          this.factureService.Delete(id).subscribe(res => {
            if (res) {
              swal(text.success, '', 'success');
              this.rerender();
            }
          });
        } else {
          toastr.success(text.failed, text.title, {
            positionClass: 'toast-top-center',
            containerId: 'toast-top-center',
          });
        }
      });
    });
  }

  exportFactures(body) {

    //
    if (body.type === 'relanceFacture') {
      this.factureService.exportreleveRelanceFacture(body.params).subscribe((res: any) => {
        // Get time stamp for fileName.
        var stamp = new Date().getTime();

        // file type
        var fileType = 'application/pdf';

        // file extension
        var extension = 'pdf';

        AppSettings.downloadBase64(
          ',' + res.facturesParPeriod,
          'FA_' + stamp + '.' + extension,
          fileType,
          extension
        );

        res.facturesAndAvoirsDetail.forEach((element, index) => {
          AppSettings.downloadBase64(
            ',' + element,
            'Doc_' + index + stamp + '.' + extension,
            fileType,
            extension
          );
        });
      });
    }

    if (body.type === 'factureParPeriod') {

      this.factureService.exportFactureParPeriod(body.params).subscribe((res: any) => {
        // Get time stamp for fileName.
        var stamp = new Date().getTime();

        // file type
        var fileType = 'application/pdf';

        // file extension
        var extension = 'pdf';

        AppSettings.downloadBase64(
          ',' + res.facturesParPeriod,
          'FA_' + stamp + '.' + extension,
          fileType,
          extension
        );

        res.facturesAndAvoirsDetail.forEach((element, index) => {
          AppSettings.downloadBase64(
            ',' + element,
            'Doc_' + index + stamp + '.' + extension,
            fileType,
            extension
          );
        });
      });
    }
  }

  navigateToFactureDetail(idFacture: number) {
    let url = this.idChantier != null ? `/chantiers/detail/${this.idChantier}/facture/${idFacture}` : `factures/detail/${idFacture}`;
    this.router.navigate([url]);
  }

  getTranslationByKey(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.translate.get(key).subscribe(
        translation => resolve(translation),
        err => reject(err)
      );
    });
  }

  loadClient(facture: Facture) {

    if (facture == null) return facture;
    if (facture.infoClient == null) return facture;

    let infoClient: infoClientModel = new infoClientModel();
    infoClient = JSON.parse(facture.infoClient);
    return infoClient.nom;

  }

  /**
* double clique pour passer au details de fiche intervention
*/
  preventSingleClick = false;
  timer: any;

  doubleClick(idFacture) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    this.navigateToFactureDetail(idFacture);
  }

}
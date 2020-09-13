import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { LotsService } from 'app/services/lots/lots.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { Lots, LotProduits } from 'app/Models/Entities/Lots';
import { Produit } from 'app/Models/Entities/Produit';
import { ArticleType } from 'app/Models/article-type';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'select-lot',
  templateUrl: './select-lot.component.html',
  styleUrls: ['./select-lot.component.scss']
})
export class SelectLotComponent implements OnInit, OnChanges {
  @Input('reload') reload: { loadLots };
  @Output('ONAdd') ONAdd = new EventEmitter();

  search = ""; // zone de recherche
  page = 1; // Current page des
  lots: Lots[] = [];
  totalPage = 1; // total des pages
  loadingFinished = false; // si la liste chargé
  lotsTmp: { data: (Produit | Lots), qte: number, type: number, remise: number }[] = []; // les Produit choisi dans popup
  articleType: ArticleType = new ArticleType();


  constructor(private lotsService: LotsService, private translate: TranslateService) { }

  ngOnChanges(): void {
    this.reload.loadLots = this.getlots.bind(this);
  }
  ngOnInit() {
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
  }

  getlots() {
    this.lotsTmp = [];
    this.lotsService.GetAll(this.search, this.page, AppSettings.NBR_ITEM_PER_PAGE, "reference", "desc").subscribe(res => {
      this.lots = res.list;
      this.totalPage = res.totalPages;
      this.loadingFinished = true;
    });
  }

  // On cas de scroll dans popup des lots
  onScrollLots() {
    if (this.totalPage != this.page) {
      this.page++;
      this.getlots();
    }
  }

  // C'est pour change la quantite d'un lot
  changeQuantiteLot(index, value, changed) {
    let lot = this.lotsTmp[index];
    if (value != null) lot.qte += value;
    if (changed != null && changed != '') lot.qte = parseInt(changed);
    if (lot.qte <= 0) lot.qte = 1;
  }
  ajouterChampsRemise(lotProduits: LotProduits[]): LotProduits[] {
    lotProduits.forEach(p => {
      p.remise = 0;
    })
    return lotProduits;
  }
  addTmpLots(index, value) {
    
    if (value != '') {
      this.lots[index].lotProduits = this.ajouterChampsRemise(this.lots[index].lotProduits);
      this.lotsTmp.unshift({
        data: this.lots[index],
        qte: value != null ? parseInt(value) : 1,
        type: this.articleType.lot,
        remise: 0
      });
      this.lots.splice(index, 1);
    }
  }

  // Recherche des articles dans popup
  searchLots() {
    this.page = 1;
    this.lots = [];
    this.getlots();

  }

  addLots() {
    this.ONAdd.emit(this.lotsTmp);
  }

  removelotTmp(index) {
    this.lots.push(this.lotsTmp[index].data as Lots);
    this.lotsTmp.splice(index, 1);
  }

}
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppSettings } from 'app/app-settings/app-settings';
import { TranslateService } from '@ngx-translate/core';
import { ProduitService } from '../../../services/produit/produit.service';
import { Tva } from '../../../Models/Entities/Tva';
import { Unite } from '../../../Models/Entities/Unite';
import { Categorie } from '../../../Models/Entities/Categorie';
import { ActionHistorique } from './../../../Enums/ActionHistorique.Enum';
import { Historique } from 'app/Models/Entities/Historique';
import { FournisseurService } from '../../../services/fournisseur/fournisseur.service';
import { Fournisseur } from '../../../Models/Entities/Fournisseur';
import { LoginService } from 'app/services/login/login.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { conversion } from 'app/common/prix-conversion/conversion';
import { TypeParametrage } from 'app/Enums/TypeParametrage.Enum';
import { ParameteresService } from 'app/services/parameteres/parameteres.service';
import { PrixParDefault } from 'app/Models/prix-par-default';
import { Produit } from 'app/Models/Entities/Produit';
import { Lots } from 'app/Models/Entities/Lots';
import { ArticleType } from 'app/Models/article-type';
declare var toastr: any;

@Component({
  selector: 'form-produit',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss'],
})
export class ProduitFormComponent implements OnInit, OnChanges {
  public ListeTva: Tva[];
  public ListeUnite: Unite[];
  public ListeCategorie: Categorie[];
  public PrixParFournisseur = [];
  public FournisseurList: Fournisseur[];
  public form = null;
  public actionHistorique: ActionHistorique = new ActionHistorique();
  public conversion = new conversion();
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    placeholder: 'Description',
  };
  public addInDb: boolean = true;
  public produit: Produit = null;
  @Output('OnSave') OnSave = new EventEmitter();
  @Input('reload') reload: { createForm };
  public articleType: ArticleType = new ArticleType();
  typeRemiseGloabl = '€';
  initialisation = {
    unite: false,
    categorie: false,
    tva: false,
    fournisseur: false
  };

  constructor(
    private fb?: FormBuilder,
    private translate?: TranslateService,
    private produitService?: ProduitService,
    private FournisseurService?: FournisseurService,
    private loginService?: LoginService,
    private parameteresService?: ParameteresService
  ) { }

  ngOnInit() {
    //définir la langue utilisée dans les texts affichée
    this.translate.setDefaultLang(AppSettings.lang);
    this.translate.use(AppSettings.lang);
    //intialisations
    this.createForm(null);
  }

  ngOnChanges() {
    this.reload.createForm = this.createForm.bind(this);
  }

  usedForAdd = false;
  createForm(article: { data: Produit; qte: number; type: number; remise: number } | any) {
    if (article == null || article.data == null) {
      this.form = this.fb.group({
        reference: [null, [Validators.required], this.CheckUniqueReference.bind(this)],
        nom: [null, [Validators.minLength(2), Validators.required]],
        description: [''],
        designation: [''],
        nomber_heure: [0],
        cout_materiel: [0],
        cout_vente: [0],
        tva: [0],
        unite: [null],
        categorie: [null],
        qte: [0],
        remise: [0],
      });
      this.usedForAdd = true;
    }

    if (article != null && article.data != null) {
      this.form = this.fb.group({
        reference: [
          article.data.reference,
          [Validators.required],
          this.CheckUniqueReference.bind(this),
        ],
        nom: [article.data.nom, [Validators.minLength(2), Validators.required]],
        description: [article.data.description],
        designation: [article.data.designation],
        nomber_heure: [article.data.nomber_heure],
        cout_materiel: [article.data.cout_materiel],
        cout_vente: [article.data.cout_vente],
        tva: [article.data.tva],
        unite: [article.data.unite],
        categorie: [article.data.categorie],
        qte: [article.qte],
        remise: [article.remise],
      });

      this.PrixParFournisseur = [
        {
          id: 0,
          IdProduit: article.data.id != undefined ? article.data.id : article.data.Id,
          idFournisseur:
            article.data.id_fournisseur != undefined
              ? article.data.id_fournisseur
              : article.data.Id_fournisseur,
          default: true,
          prix:
            article.data.prix_fournisseur != undefined
              ? article.data.prix_fournisseur
              : article.data.Prix_fournisseur,
        },
      ];

      this.produit = article.data;
      this.usedForAdd = false;
    }
  }

  /** creation d'un référence de la formulaire de creation*/
  get f() {
    return this.form.controls;
  }

  /**vérifier que le référence est unique dans la base de donnée*/
  CheckUniqueReference(control: FormControl): Promise<{}> {
    let promise = new Promise((resolve, reject) => {
      this.produitService.CheckUniqueReference(control.value).subscribe(res => {
        if (
          control.value != '' &&
          (this.produit == null ? true : control.value != this.produit.reference)
        ) {
          if (res == true) {
            resolve({ CheckUniqueReference: true });
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
    return promise;
  }

  /**récupérer la liste des unité de la base de données*/
  getListeUnite(): void {
    if (!this.initialisation.unite) {
      this.produitService.getListeUnite().subscribe(Unite => {
        this.ListeUnite = Unite.result;
        this.initialisation.unite = true
      });
    }
  }

  /**récupérer la liste des catégorie de la base de données*/
  getListeCategorie(): void {
    if (!this.initialisation.categorie) {
      this.produitService.getListeCategorie().subscribe(Categorie => {
        this.ListeCategorie = Categorie.result;
        this.initialisation.categorie = true;
      });
    }
  }

  /*--------------------------------------------------
    formater l'objet qui contient les information qui nous voulons ajouter
    -------------------------------------------------*/
  formaterProduitBody(formValues: any) {
    //ajouter l'historique
    let historique = new Historique();
    historique.IdUser = this.loginService.getUser().id;
    historique.action = this.actionHistorique.Added;
    formValues['Id'] = this.produit == null ? 0 : this.produit.id;

    formValues['Historique'] = '[]';
    formValues['FichesTechniques'] = '[]';
    formValues['Labels'] = '[]';

    //ajouter le Prix Par Fournisseur
    formValues['Id_fournisseur'] =
      this.PrixParFournisseur.length == 0
        ? null
        : parseInt(this.PrixParFournisseur[0].idFournisseur);
    formValues['Prix_fournisseur'] =
      this.PrixParFournisseur.length == 0 ? null : parseInt(this.PrixParFournisseur[0].prix);

    formValues['prixHt'] = this.TotalHt();
    return formValues;
  }

  save() {

    if (this.checkFormIsValid() && this.PrixParFournisseur.length == 1) {
      let formValues = this.form.value;
      formValues = this.formaterProduitBody(formValues);
      let article: { data: Produit | Lots; qte: number; type: number; remise: number } = {
        data: formValues,
        qte: formValues.qte,
        remise: formValues.remise,
        type: this.articleType.produit,
      };
      if (this.addInDb) {
        this.addProduit(formValues);
      } else {
        this.translate.get('addproduit').subscribe(text => {
          toastr.success(text.msg, text.title, {
            positionClass: 'toast-top-center',
            containerId: 'toast-top-center',
          });
        });
      }
      this.PrixParFournisseur = [];
      this.OnSave.emit(article);
      this.createForm(null);
    } else {
      this.translate.get('errors').subscribe(text => {
        toastr.warning(text.fillAll, '', {
          positionClass: 'toast-top-center',
          containerId: 'toast-top-center',
        });
      });
    }
  }
  addProduit(body) {
    this.produitService.Add(body).subscribe(
      res => {
        if (res) {
          this.translate.get('addproduit').subscribe(text => {
            toastr.success(text.msg, text.title, {
              positionClass: 'toast-top-center',
              containerId: 'toast-top-center',
            });
          });
        }
      },
      err => {
        this.translate.get('errors').subscribe(text => {
          toastr.warning(text.fillAll, '', {
            positionClass: 'toast-top-center',
            containerId: 'toast-top-center',
          });
        });
      }
    );
  }
  checkFormIsValid(): boolean {

    let valid = true;
    for (let key in this.form.controls) {
      if (this.form.controls[key].errors != null) {
        valid = false;
      }
    }
    return valid;
  }

  /*--------------------------------------------------
      récupérer la liste des Fournisseur de la base de données
    --------------------------------------------------*/
  GetFournisseurList() {
    if (!this.initialisation.fournisseur) {
      this.FournisseurService.GetAll('', 1, AppSettings.MAX_GET_DATA, 'nom', 'asc').subscribe(res => {
        this.FournisseurList = res.list;
        this.initialisation.fournisseur = true;
      });
    }
  }

  /*--------------------------------------------------
    si le Prix Par Fournisseur est ajouter ou supprimer ou modifier 
    le 'composant' responsable de 'crud' les Prix Par Fournisseur retourner la nouvelle liste de ces Prix
    => il faut les ajouter dans un variable de type tableau Qu'il a ajouer dans l'objet qui nous envoyer au serveur
    -------------------------------------------------*/
  getPrixParFournisseurList(List) {
    this.PrixParFournisseur = List;
  }

  // Récupuerer tva par defaut
  GetParametrageTva() {
    if (!this.initialisation.tva) {
      this.parameteresService.Get(TypeParametrage.tva).subscribe(res => {
        const data = JSON.parse(res.contenu);
        this.form.controls['tva'].setValue(parseInt(data['tvaDefaut']));
        this.initialisation.tva = true;
      });
    }
  }

  calculate_cout_horaire(): any {
    return parseFloat(this.form.value.nomber_heure) * parseFloat(this.form.value.cout_vente);
  }

  prixTtc() {
    const tva = this.form.controls.tva.value / 100 + 1;
    const TotalHt = this.TotalHt();
    return TotalHt * tva;
  }

  TotalHt() {
    let totalHt = this.calculate_cout_horaire() + this.form.value.cout_materiel;
    let remise = 0;
    if (this.form.value.remise != 0) {
      if (this.typeRemiseGloabl == '€') {
        remise = this.form.value.remise;
      } else {
        remise = totalHt * (this.form.value.remise / 100);
      }
    }
    let result = totalHt - remise;
    return isNaN(result) ? 0 : result;
  }

  getCouteVenteFromParamerage() {
    if (this.form.value['cout_vente'] == 0) {
      this.parameteresService.Get(TypeParametrage.prix).subscribe(res => {
        let PrixParDefault: PrixParDefault = JSON.parse(res.contenu);
        this.form.controls['cout_vente'].setValue(PrixParDefault.prixVente);
      });
    }
  }
}

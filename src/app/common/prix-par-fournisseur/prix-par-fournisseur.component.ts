import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { PrixParFournisseur } from './../../Models/prixParFournisseur';
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

declare var swal: any;
declare var toastr: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'prix-par-fournisseur',
  templateUrl: './prix-par-fournisseur.component.html',
  styleUrls: ['./prix-par-fournisseur.component.scss']
})
export class PrixParFournisseurComponent implements OnInit {

  @Input('PrixParFournisseur') public PrixParFournisseur: PrixParFournisseur[] = [];
  @Input('FournisseurList') public FournisseurList: PrixParFournisseur[] = [];
  @Output('PrixParFournisseurList') public PrixParFournisseurList = new EventEmitter();
  @Input("readOnly") readOnly: boolean = false;
  @Input("hideAddBtn") hideAddBtn: boolean = false;
  @Output('OnOpen') public OnOpen = new EventEmitter();
  @ViewChild('IdFournisseur') IdFournisseur;
  @ViewChild('Prix') Prix;
  @ViewChild('Default') default;
  @Input("xl") xl: boolean = true;
  public erreurMsg: boolean = false;
  public OperationsType: number;
  public PrixParFournisseurIndex;
  public CachedPrixParFournisseur: PrixParFournisseur;
  form;
  constructor(private translate?: TranslateService, private fb?: FormBuilder, ) { }

  ngOnInit() {
    this.form = this.fb.group({
      Prix: ["", [Validators.required]],
      IdFournisseur: [null, [Validators.required]],
    });
  }


  select(fournisseur) {
    this.form.controls["Prix"].setValue(parseFloat(fournisseur.prix));
    this.form.controls["IdFournisseur"].setValue(fournisseur.idFournisseur);
  }

  add(): void {
    if (this.form.valid) {
      this.PrixParFournisseur.push({ prix: this.form.value.Prix, idFournisseur: this.form.value.IdFournisseur, default: true });
      this.PrixParFournisseurList.emit(this.PrixParFournisseur);
      this.translate.get("PrixParFournisseur").subscribe(text => {
        toastr.success(text.ajoutersuccess, text.title, { positionClass: 'toast-top-center', containerId: 'toast-top-center' });


        this.inputInitialisation();
      });
    }
  }

  deletePrixParFournisseur(index) {
    this.translate.get("PrixParFournisseur.delete").subscribe(text => {
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
          /*this.removedFournsseur.forEach((RF, i) => {
            let id = this.PrixParFournisseur[index].idFournisseur;
            let RFId = RF.id.toString();
            if (id == RFId) {
              this.FournisseurList.push(RF);
              this.PrixParFournisseur.splice(index, 1);
              this.removedFournsseur.splice(i, 1);
              swal(text.success, "");
              this.PrixParFournisseurList.emit(this.PrixParFournisseur);
              return
            }
          });*/
          this.PrixParFournisseur = [];
          this.PrixParFournisseurList.emit(this.PrixParFournisseur);
          swal(text.success, "");

        } else {
          swal(text.cancel, "", "error");
        }
      });
    });
  }

  update() {
    if (this.form.valid) {
      this.PrixParFournisseur[this.PrixParFournisseurIndex].prix = parseFloat(this.form.value.Prix)
      this.PrixParFournisseur[this.PrixParFournisseurIndex].idFournisseur = this.form.value.IdFournisseur
      this.PrixParFournisseurList.emit(this.PrixParFournisseur);
      this.translate.get("PrixParFournisseur").subscribe(text => {
        toastr.success(text.modifiersucces, text.title, { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
        this.inputInitialisation();
      });
    }
  }

  get f() { return this.form.controls; }
  //initialiser si la process est success
  inputInitialisation() {
    this.form.controls["Prix"].setValue('');
    this.form.controls["IdFournisseur"].setValue('');
    jQuery("#AddPrixParFournisseurModel").modal("hide");
    jQuery("#EditPrixParFournisseurModel").modal("hide");
  }

  open() {
    this.OnOpen.emit()
  }
  closeModal() {
    jQuery("#AddPrixParFournisseurModel").modal("hide");
  }
}
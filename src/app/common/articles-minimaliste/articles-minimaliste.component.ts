import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { AppSettings } from "app/app-settings/app-settings";
import { TranslateService } from "@ngx-translate/core";
import { PieceJoin } from 'app/Models/Entities/PieceJoint';

declare var toastr: any;
declare var swal: any;
@Component({
  selector: 'articles-minimaliste',
  templateUrl: './articles-minimaliste.component.html',
  styleUrls: ['./articles-minimaliste.component.scss']
})
export class ArticlesMinimalisteComponent implements OnInit, OnChanges {
  public form = null;
  @Input('data') data = null;
  @Input('load') load: { getData };
  @Input('readOnly') readOnly = false;

  constructor(private translate: TranslateService, private fb: FormBuilder) { }

  ngOnInit() {

    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      totalHt: [
        (this.data == null ? null : this.data.totalHt),
        [Validators.required]
      ],
      puc: [
        (this.data == null ? null : this.data.puc),
        [Validators.required]
      ],
      prorata: [
        (this.data == null ? null : this.data.prorata),
        [Validators.required]
      ],
      tva: [
        (this.data == null ? null : this.data.tva),
        [Validators.required]
      ],
      devisExel: [
        (this.data == null ? null : this.data.devisExel),
        [Validators.required]
      ]
    });
  }

  ngOnChanges() {
    this.createForm();
    if (this.load == undefined) return;
    this.load.getData = this.returnData.bind(this);

  }

  startUpload(event: FileList) {
    const file = event.item(0)
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let pieceJoin = new PieceJoin()
      pieceJoin.name = AppSettings.guid()
      pieceJoin.type = file.name.substring(file.name.lastIndexOf('.') + 1)
      pieceJoin.orignalName = file.name
      pieceJoin.file = reader.result.toString();
      if (pieceJoin.type != 'xlsx') {
        this.translate.get("errors").subscribe(text => {

          toastr.warning(text.fichierexel, text.fichierAcceptable, { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
        })
        return
      }

      this.form.controls["devisExel"].setValue(pieceJoin);
    }
  }

  get f() { return this.form.controls; }

  returnData(callBack) {
    if (this.form.valid) {
      callBack(this.form.value);
    } else {
      callBack(false);
    }
  }

  removeFile() {


    this.translate.get("file.delete").subscribe(text => {
      swal({
        title: "Supprimer",
        text: '',
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
          this.form.controls["devisExel"].setValue(null);
          swal(text.success, "", "success");
        } else {
          swal(text.cancel, "", "error");
        }
      });
    });

  }

  downloadFile() {
    let pieceJointe = this.form.value.devisExel;
    AppSettings.downloadBase64(pieceJointe.file, pieceJointe.orignalName, pieceJointe.file.substring("data:".length, pieceJointe.file.indexOf(";base64")), pieceJointe.type)
  }

}
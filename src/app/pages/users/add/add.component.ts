import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl, FormGroup } from "@angular/forms";
import { UtilisateurService } from "app/services/users/user.service";
import { Router } from "@angular/router";
import { Historique } from "app/Models/Entities/Historique";
import { AppSettings } from "app/app-settings/app-settings";
import { TranslateService } from "@ngx-translate/core";
import { ActionHistorique } from "./../../../Enums/ActionHistorique.Enum"
import { LoginService } from "app/services/login/login.service";
import { ParameteresService } from "app/services/parameteres/parameteres.service";
import { TypeNumerotation } from "app/Enums/TypeNumerotation.Enum";
import { Profile } from "app/Models/Entities/Profile";
import { UserProfile } from "app/Enums/user-profile.enum";
import { TypeParametrage } from "app/Enums/TypeParametrage.Enum";
declare var toastr: any;

@Component({
    selector: "app-add",
    templateUrl: "./add.component.html",
    styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {

    public form: FormGroup;

    public typeNumerotation: typeof TypeNumerotation = TypeNumerotation;

    constructor(
        private fb: FormBuilder,
        private utilisateurService: UtilisateurService,
        private router: Router,
        private translate: TranslateService,
        private actionHistorique: ActionHistorique,
        private loginService: LoginService,
        private paramteresService: ParameteresService
    ) {
        this.form = this.fb.group({
            nom: ["", [Validators.minLength(2), Validators.required]],
            prenom: ["", [Validators.minLength(2), Validators.required]],
            actif: [true],
            email: [null, [Validators.pattern(AppSettings.regexEmail)]],
            phonenumber: ["", [Validators.minLength(10), Validators.pattern(AppSettings.regexPhone)]],
            username: ["", [Validators.minLength(6), Validators.required]],
            password: ["", [Validators.minLength(6), Validators.required]],
            confirmpassword: ["", [Validators.minLength(6), Validators.required]],
            idprofile: ['', Validators.required],
            matricule: [null, [Validators.required]]
        }, { validator: this.checkPasswords });
        this.generateReference()
    }

    get f() { return this.form.controls; }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmpassword.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    ngOnInit() {
        this.translate.setDefaultLang(AppSettings.lang);
        this.translate.use(AppSettings.lang);
        this.getProfiles();
    }
    public Profiles: Profile[] = [];
    getProfiles() {
        this.translate.get("labels").subscribe(labels => {
            this.Profiles.push({ id: UserProfile.admin, libelle: labels.admin });
            this.Profiles.push({ id: UserProfile.technicien, libelle: labels.technicien });
            this.Profiles.push({ id: UserProfile.manager, libelle: labels.manager });
        });
    }

    add() {

        if (this.form.valid) {
            this.translate.get("add").subscribe(text => {
                let values = this.form.value;
                // UserProfile = Count = 0
                // values["UserProfile"] = values.profile == "" || values.profile == undefined ? [] : [{ Idprofile: values.profile }]
                // delete values.profile;
                // (values);

                let historique = new Historique();
                historique.IdUser = this.loginService.getUser().id;
                historique.action = this.actionHistorique.Added;
                values["historique"] = JSON.stringify([historique]);
                values["actif"] = this.f.actif.value ? 1 : 0;
                this.utilisateurService.Add(values).subscribe(res => {
                    if (res) {
                        this.IncremenetRefernce();
                        toastr.success(text.msg, text.title,{positionClass: 'toast-top-center', containerId: 'toast-top-center'});
                        this.router.navigate(["/utilisateurs/detail", res.id]);
                    }
                });
            });
        } else {
            this.translate.get("errors").subscribe(text => {
                toastr.warning(text.fillAll, "", { positionClass: 'toast-top-center', containerId: 'toast-top-center' });
            })
        }
    }

  


    generateReference() {
        this.paramteresService.Generate(this.typeNumerotation.agent as number)
            .subscribe(res => {
                this.form.controls["matricule"].setValue(res['data']);
            })
    }

    IncremenetRefernce(): void {
        this.paramteresService.Increment(this.typeNumerotation.agent as number)
            .subscribe(res => { })
    }
}

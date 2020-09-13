import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';

declare var $: any;
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(private router: Router, private route: ActivatedRoute, private translate: TranslateService) {
    }

    ngOnInit() { 
        $.getScript('./assets/app/js/core/app.js');
        $.getScript('./assets/app/js/core/app-menu.js');
        this.translate.setDefaultLang(AppSettings.lang)
        this.translate.use(AppSettings.lang)

        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    i = 0;
    clickSubMenu(index, e) { 
        var className = e.srcElement.offsetParent.className
        this.i++;
        if (this.menuItems[index].submenu.length > 0 && this.i > 1) {
            if (className.includes("open") && (this.menuItems[index].open == null || this.menuItems[index].open == false)) {
                this.menuItems[index].open = true;
            } else if (this.menuItems[index].open == null || this.menuItems[index].open == false) {
                this.menuItems[index].open = true;
                this.menuItems[index].class += " open"
            } else {
                this.menuItems[index].open = false;
                let classe = this.menuItems[index].class as string;
                this.menuItems[index].class = classe.replace(" open", "");
            }
        }
    }

}

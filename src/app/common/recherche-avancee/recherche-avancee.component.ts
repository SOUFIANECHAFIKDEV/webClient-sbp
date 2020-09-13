import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'recherche-avancee',
  templateUrl: './recherche-avancee.component.html',
  styleUrls: ['./recherche-avancee.component.scss']
})
export class RechercheAvanceeComponent implements OnInit {
  showCardBody: boolean = true;
  @Output('OnOpen') OnOpen = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  open() {
    this.OnOpen.emit();
  }

}

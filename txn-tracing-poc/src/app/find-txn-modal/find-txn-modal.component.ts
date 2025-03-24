import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-txn-modal',
  templateUrl: './find-txn-modal.component.html',
  styleUrls: ['./find-txn-modal.component.scss']
})
export class FindTxnModalComponent implements OnInit {
  module: any = ''
  businessFlow: any = ''
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelectTransaction(): void {

  }
}

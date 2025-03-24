import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TransactionTrailComponent } from './transaction-trail/transaction-trail.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { FindTxnModalComponent } from './find-txn-modal/find-txn-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    TransactionTrailComponent,
    FindTxnModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TimelineModule,
    CardModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

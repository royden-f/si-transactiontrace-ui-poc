import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as dayjs from 'dayjs';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  details?: any;
}
type ErrorMessage = {
  title?: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
};

@Component({
  selector: 'app-transaction-trail',
  templateUrl: './transaction-trail.component.html',
  styleUrls: ['./transaction-trail.component.scss'],
})
export class TransactionTrailComponent implements OnInit {
  siTxnKey = '0959595a-b224-452a-a003-f3a79f321edf';
  errors: ErrorMessage[] = [];
  transactionResponse: any = {};
  transactionDetail: any;
  moduleMap: Map<string, string> = new Map([
    ['mem', 'Member'],
    ['prv', 'Provider'],
    ['clm', 'Claims'],
  ]);
  iconMap: Map<string, string> = new Map([
    ['Req_Received', 'fa-solid fa-cloud-arrow-down'],
    ['Schema_Validated_for_Request', 'fa-solid fa-gear'],
    ['Business_Rules_Validated_for_Request', 'fa-solid fa-gear'],
    ['Filter_Applied', 'fa-solid fa-gears'],
    ['Response_Sent', 'fa-solid fa-check'],
    ['Mask_Applied', 'fa-solid fa-square-binary'],
    ['Response_Validated', 'fa-solid fa-check-double'],
  ]);
  events: EventItem[] = [];
  currentView: number = 1
  constructor(private _http: HttpClient, private _datePipe: DatePipe) {}

  ngOnInit(): void {}

  getTransactions(transactionKey: string) {
    //return this._http.get(`https://si-dashboard-svc-si-dev.apps.oscluster01.devtest.platformgainwell.com/api/v1/si/txn_trace?txn_key=${transactionKey}`);
    return this._http.get(
      `http://localhost:3001/api/v1/si/dashboard/txn_trace1`
    );
  }

  onFindAction() {
    if (!this.siTxnKey) {
      this.showToast(
        'Transaction Key Missing',
        'Transaction key field cannot be empty, Please enter a valid transaction key',
        'warning'
      );
      return;
    }
    this.getTransactions(this.siTxnKey)
      .pipe(
        catchError((error: any) => {
          if (error.status === 404) {
            if (
              error.error &&
              error.error?.txnKey
                .toLowerCase()
                .includes('please check the txn key')
            ) {
              this.showToast(
                'No data',
                'Please try again using valid or a different transaction key',
                'warning'
              );
            }
            this.transactionResponse = {};
            this.transactionDetail = null;
            return of(undefined);
          } else {
            throw error;
          }
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.errors = [];
          const txnResponse = {
            ...data,
            txnTraces: [...data.txnTraces].sort((a: any, b: any) => {
              // First, compare by sequenceNumber
              if (Number(a.siSeqId) !== Number(b.siSeqId)) {
                return Number(a.siSeqId) - Number(b.siSeqId);
              }
              // If sequenceNumber is the same, compare by createTs (date)
              return dayjs(a.createTs).isBefore(dayjs(b.createTs)) ? -1 : 1;
            }),
          };
          txnResponse.txnTraces = this.updateTransactionTimeDifferences(
            txnResponse.txnTraces
          );
          console.table(txnResponse.txnTraces);
          const txnLength = txnResponse.txnTraces.length;
          const txnStartTime = dayjs(txnResponse.txnTraces[0].createTs);
          const txnEndTime = dayjs(
            txnResponse.txnTraces[txnLength - 1].createTs
          );
          const timeTaken = txnEndTime.diff(txnStartTime);
          console.log('txnStart' + txnStartTime);
          console.log('txnEnd' + txnEndTime);
          console.log('txnDiff' + timeTaken);
          this.transactionResponse = txnResponse;
          this.transactionDetail = {
            module: txnResponse.txnTraces[0].siModule,
            businessFlow: txnResponse.txnTraces[0].siBusinessFlow,
            txnKey: txnResponse.txnKey,
            txnTimeTaken: timeTaken,
          };
          this.createTimelineEvents(txnResponse.txnTraces);
        }
      });
  }
  createTimelineEvents(txnTraces: any) {
    this.events = [];
    txnTraces.forEach((txn: any) => {
      this.events.push({
        status: txn.siTxnState,
        date: this._datePipe.transform(txn.createTs, 'medium') || '',
        icon: this.getIcon(txn.siTxnState),
        color: '#1cc88a',
        details: txn,
      });
    });
  }

  showToast(title: string, message: string, type: any) {
    this.errors.push({ title, message, type });
  }

  getModuleName(moduleShort: string) {
    moduleShort = moduleShort.toLowerCase();
    return this.moduleMap.has(moduleShort)
      ? this.moduleMap.get(moduleShort)
      : moduleShort;
  }

  getIcon(txnState: string) {
    return this.iconMap.has(txnState) ? this.iconMap.get(txnState) : '';
  }

  updateTransactionTimeDifferences(txnTraces: any) {
    return txnTraces.map((txn: any, index: number, arr: any) => {
      // Skip the first transaction, since there's no previous transaction to compare
      if (index === 0) {
        return txn; // Return the first transaction as is
      }

      // Get the previous transaction's timestamp
      const prevTimestamp = dayjs(arr[index - 1].createTs);
      const currTimestamp = dayjs(txn.createTs);

      // Calculate the time difference in milliseconds
      const timeDiff = currTimestamp.diff(prevTimestamp); // Difference in milliseconds

      // Return a new transaction with the time difference properties
      return {
        ...txn,
        timeDifferenceMs: timeDiff,
      };
    });
  }

  switchView(viewNo: number) {
    this.currentView = viewNo;
  }
}

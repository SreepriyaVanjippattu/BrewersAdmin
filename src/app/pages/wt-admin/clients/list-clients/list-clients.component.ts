import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { ApiProviderService } from '../../../../core/api-services/api-provider.service';
import { ModalService } from '../.../../../../modal';
import { NbToastrService } from '@nebular/theme';
import { StatusUse } from '../../../../models/status-id-name';
import { apiConfig } from '../../../../../environments/api-config';
import * as XLSX from 'xlsx';
import { String } from "typescript-string-operations";
import { environment } from '../../../../../environments/environment';
import {Constants} from '../../../../models/constants';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss'],
})
export class ListClientsComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  toggleStatus: Boolean;
  clientToArchive: any;
  headerValue: any;
  clientList;
  resultContent;
  levelNum;
  next;
  previous;
  config = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 20,
    searchPage: 1,
  };
  page: any;
  status = StatusUse;
  archiveId: any;
  pageControl;
  tenantId: string;
  tenantStatus: any;
  userProfile: any;
  currentUser: any;
  searchText: string;
  envURL: any;
  
  constructor(
    private httpService: HttpClient,
    private apiService: ApiProviderService,
    private router: Router,
    private modalService: ModalService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.userProfile = user['userDetails'];
    this.currentUser = this.userProfile.userId;
    this.tenantId = this.userProfile.tenantId;
    this.toggleStatus = false;
    this.envURL = environment.API.emailUrl;
    this.page = this.route.snapshot.queryParamMap.get('page');
    if (this.page) {
      this.getClientsList(this.page, this.config.itemsPerPage, this.searchText);
    } else {
      this.getClientsList(this.config.currentPage, this.config.itemsPerPage, this.searchText);
    }
  }

  openModal(id) {
    if (id) {
      this.modalService.open(id);
    }
  }

  editClientDirectory(clientId) {
    this.router.navigate(['app/clients/edit/' + clientId]);
  }


  goToViewDetails(clientId) {
    this.router.navigate(['app/clients/viewClient/' + clientId]);
  }

  archiveClientDirectory() {
    this.router.navigate(['app/clients/archives']);
  }

  filter(label) {
    if (this.clientList) {
      if (this.toggleStatus === true && label === 'company') {
        this.clientList.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'company') {
        this.clientList.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? 1: -1);
      }
      if (this.toggleStatus === true && label === 'package') {
        this.clientList.sort((a, b) => a.package.toUpperCase() > b.package.toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'package') {
          this.clientList.sort((a, b) => a.package.toUpperCase() < b.package.toUpperCase() ? 1 : -1);
      }
      if (this.toggleStatus === true && label === 'name') {
        this.clientList.sort((a, b) => a.orgSuperUser.firstName.toUpperCase() > b.orgSuperUser.firstName.toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'name') {
        this.clientList.sort((a, b) => a.orgSuperUser.firstName.toUpperCase() < b.orgSuperUser.firstName.toUpperCase() ? 1: -1);
      }
      if (this.toggleStatus === true && label === 'user') {
        this.clientList.sort((a, b) => a.orgSuperUser.emailAddress.toUpperCase() > b.orgSuperUser.emailAddress.toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'user') {
        this.clientList.sort((a, b) => a.orgSuperUser.emailAddress.toUpperCase() < b.orgSuperUser.emailAddress.toUpperCase() ? 1: -1);
      }
      if (this.toggleStatus === true && label === 'phone') {
        this.clientList.sort((a, b) => a.ContactPhone < b.ContactPhone ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'phone') {
        this.clientList.sort((a, b) => a.contactPhone > b.contactPhone? 1: -1);
      }
      if (this.toggleStatus === true && label === 'email') {
        this.clientList.sort((a, b) => a.contactEmail.trim().toUpperCase() < b.contactEmail.trim().toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'email') {
        this.clientList.sort((a, b) => a.contactEmail.trim().toUpperCase() > b.contactEmail.trim().toUpperCase() ? 1: -1);
      }
      if (this.toggleStatus === true && label === 'expiry') {
        this.clientList.sort((a, b) => a.localTime < b.localTime ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'expiry') {
        this.clientList.sort((a, b) => a.localTime > b.localTime ? 1: -1);
      }
      if (this.toggleStatus === true && label === 'status') {
        this.clientList.sort((a, b) => a.status.toUpperCase() < b.status.toUpperCase() ? 1: -1);
      }
      else if (this.toggleStatus === false && label === 'status') {
        this.clientList.sort((a, b) => a.status.toUpperCase() > b.status.toUpperCase() ? 1: -1);
      }
    }
    this.toggleStatus = !this.toggleStatus;
  }

  getClientsList(pageNumber, pageSize,searchText) {
    this.router.navigate(['app/clients'], {
      queryParams: {
        page: this.config.currentPage,
      },
    });
    const clientDetails = this.apiService.getDataList(this.apiService.getAllActiveClients, pageNumber, pageSize,null,null, searchText).
      subscribe((response) => {
        if (response && response['body']) {
          this.clientList = response['body']['clientDetails'];
          this.clientList.forEach(element => {
            if (element.status === this.status.active.id) {
              element.status = this.status.active.name;
            }
            else if (element.status === this.status.pending.id) {
              element.status = this.status.pending.name;
            }
          });
          
          this.clientList.map((client, idx) => {
            if (client.endDate) {
              client.localTime = client.endDate.substr(0, client.endDate.indexOf('T'));
              let d = new Date(client.endDate);
              let e = d.toLocaleString();
              client.startDate = +(e);
            }

            if (client.orgSuperUser !== null) {
              client.contactName = client.orgSuperUser.firstName !== null ? client.orgSuperUser.firstName : '';
              client.userName = client.orgSuperUser.userName;
              client.primaryPhone = client.orgSuperUser.phone;
            }

            if (client.subscriptions && client.subscriptions.length > 0) {
              client.package = client.subscriptions[0].name;
              if (client.orgSuperUser !== null && client.orgSuperUser !== null) {
                // client.name = client.orgSuperUser.firstName + ' ' + client.orgSuperUser.lastName;
                client.username = client.orgSuperUser.userName;
              }
            }
          });
          this.headerValue = response["body"]["pagingDetails"];
          if (this.headerValue) {
            this.config.totalItems = this.headerValue.totalCount;
            this.pageControl = this.config.totalItems === 0 ? true : false;
          }
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.toastrService.danger(error.error.message, 'Try Again');
        } else {
          this.toastrService.danger(error, 'Try Again');
        }
      });

    this.route.queryParamMap
      .map(params => params.get('page'))
      .subscribe((page: any) => {
        return this.config.currentPage = page;
      });
  }

  pageSize(newSize) {
    this.config.itemsPerPage = newSize;
    this.getClientsList(this.config.currentPage, this.config.itemsPerPage, this.searchText);
  }

  pageChange(nextPage) {
    this.config.currentPage = nextPage;
    this.getClientsList(this.config.currentPage, this.config.itemsPerPage, this.searchText);
    this.router.navigate(['app/clients'], {
      queryParams: {
        page: nextPage,
      },
    });
  }

  printClient() {

  }

  goToArchive() {
    this.router.navigate(['app/clients/archives']);
  }

  goToClientDetails(client) {
    this.router.navigate(['app/clients/edit/' + client]);
  }

  searchClient() {
    this.getClientsList(this.config.currentPage, this.config.itemsPerPage, this.searchText);
  }

  clear() {
    this.searchText = "";
    this.searchClient();
  }
  
  getArchiveId(archiveId) {
    this.archiveId = archiveId;
  }

  archivedClick() {
    this.clientList.forEach(element => {
      if (this.archiveId === element.id) {
        this.clientToArchive = element;
      }
    });
    if (this.clientToArchive.status === Constants.ActiveStatus) {
      this.archiveClient();
    }
    else {
      this.toastrService.show('Only Active clients can be archived', 'Sorry');
    }
  }

  archiveClient() {

    const params = {
      clientId: this.clientToArchive.id,
      statusId: this.status.archive.id,
      currentUser: this.currentUser,
    };
    const archiveClientApi = String.Format(this.apiService.editClientStatus, this.clientToArchive.id)
    this.apiService.putData(archiveClientApi, params).subscribe((response: any) => {
      if (response.status === 200) {
        this.toastrService.success('Client Archived', 'Success');
        this.goToArchive();
      }
    },
    (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toastrService.danger(error.error.message, 'Try Again');
      } else {
        this.toastrService.danger(error, 'Try Again');
      }
    });
  }

  ExportToExcelClientList() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    ws['!cols'] = [];
    ws['!cols'][8] = { hidden: true };
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Client-list.xlsx');

  }

  resetpasswordClick(email,id) {
    const params = {
      emailAddress: email,
      url: this.envURL + '/login/forgot-changepassword',
    };
    const postEmailApi = String.Format(this.apiService.postEmail, id);
    this.apiService.postData(postEmailApi, params).subscribe(response => {
      if (response) {
        this.toastrService.show('Mail Sent', 'Success');
      }
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toastrService.danger(error.error.message, 'Try Again');
      } else {
        this.toastrService.danger(error, 'Try Again');
      }
    });
  }

  changeStatusClick(tenantId, status) {
   this.tenantId = tenantId;
   this.tenantStatus = status;
  }

  activateClientDirectory() {
    if (this.tenantStatus !== Constants.ActiveStatus) {
      const params = {
        clientId: this.tenantId,
        statusId: this.status.active.id,
        currentUser: this.currentUser,
      };
      const activateClientApi = String.Format(this.apiService.editClientStatus, this.tenantId);
      this.apiService.putData(activateClientApi, params).subscribe((response: any) => {
        if (response.status === 200) {
          this.toastrService.success('Client Activated', 'Success');
          this.ngOnInit();
        }
      },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.toastrService.danger(error.error.message, 'Try Again');
          } else {
            this.toastrService.danger(error, 'Try Again');
          }
        });
    } else {
      this.toastrService.show('Already Active', 'Client');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiProviderService } from '../../../../core/api-services/api-provider.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StatusUse } from '../../../../models/status-id-name';
import { NbToastrService } from '@nebular/theme';
import { String } from "typescript-string-operations";

@Component({
  selector: 'view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewclientComponent implements OnInit {
  status = StatusUse;
  phone: any;
  page: string;
  id: any;
  levelNum: number;
  beginDate;
  editClientDetails;
  package;
  formSubmitted;
  validEmail;
  getTenantContent;
  currentStatus: Number;
  tenantList: any[] = [];
  imageLink = '';
  userProfile: any;
  currentUser: any;
  tenantId: any;
  statusName: string;
  constructor(
    private httpService: HttpClient,
    private apiService: ApiProviderService,
    private router: Router,
    private forms: FormBuilder,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private toast: NbToastrService,

  ) { }

  viewClientForm = this.forms.group({
    company: [''],
    email: [''],
    phone: [],
    status: [''],
    startDate: [''],
    expiryDate: [''],
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: [''],
    firstname: [''],
    lastname: [''],
    userEmail: [''],
    userPhone: [''],
    userId: [''],
    password: [''],
  });

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.userProfile = user['userDetails'];
    this.currentUser = this.userProfile.userId;
    this.tenantId = this.userProfile.tenantId;
    this.id = this.route.snapshot.url[1].path;
    this.page = this.route.snapshot.url[0].path;
    this.getSingleEditUserDetails(this.id);
  }

  getSingleEditUserDetails(id) {
    const clientDetails = String.Format(this.apiService.getClientDetailById, id);
    this.apiService.getDataList(clientDetails, 1, 1, null, null, null).
      subscribe((response) => {
        this.editClientDetails = response['body'];
        this.setStatusName();
        this.setDataToEdit();
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          this.toast.danger(error.error.message, 'Try Again');
        } else {
          this.toast.danger(error, 'Try Again');
        }
      });
  }

  setStatusName(){
    if(this.editClientDetails.status == this.status.active.id){
      this.statusName = this.status.active.name;
    }
    else if(this.editClientDetails.status == this.status.pending.id){
      this.statusName = this.status.pending.name;
    }
  }

  setDataToEdit() {
    if (this.editClientDetails) {
      if (this.editClientDetails.subscriptions && this.editClientDetails.subscriptions.length > 0) {
        this.package = this.editClientDetails.subscriptions[0].name;
      }
      if (this.editClientDetails.name) {
        this.viewClientForm.get('company').setValue(this.editClientDetails.name.toUpperCase() + this.editClientDetails.name.substr(1).toUpperCase());
      }
      if (this.editClientDetails.contactEmail) {
        this.viewClientForm.get('email').setValue(this.editClientDetails.contactEmail);
      }
      if (this.editClientDetails.orgSuperUser) {
        if (this.editClientDetails.orgSuperUser.emailAddress) {
          this.viewClientForm.get('userEmail').setValue(this.editClientDetails.orgSuperUser.emailAddress);
        }
        if (this.editClientDetails.orgSuperUser.phone) {
          this.viewClientForm.get('phone').setValue(this.editClientDetails.orgSuperUser.phone);
        }
        if (this.editClientDetails.orgSuperUser.createdDate) {
          let startDate = this.editClientDetails.startDate;
          startDate = this.datepipe.transform(new Date(startDate), 'dd/MM/yyyy  hh:mm:ss a');
          this.viewClientForm.get('startDate').setValue(startDate);
        }
        if (this.editClientDetails.orgSuperUser.modifiedDate) {
          let expiryDate = this.editClientDetails.endDate;
          expiryDate = this.datepipe.transform(new Date(expiryDate), 'dd/MM/yyyy  hh:mm:ss a')
          this.viewClientForm.get('expiryDate').setValue(expiryDate);
        }
        if (this.editClientDetails.orgSuperUser.firstName) {
          this.viewClientForm.get('firstname').setValue(this.editClientDetails.orgSuperUser.firstName);
        }
        if (this.editClientDetails.orgSuperUser.lastName) {
          this.viewClientForm.get('lastname').setValue(this.editClientDetails.orgSuperUser.lastName);
        }
      }

      if (this.editClientDetails.address1) {
        if (this.editClientDetails.address2) {
          this.viewClientForm.get('street').setValue(
            this.editClientDetails.address1[0].toUpperCase() + this.editClientDetails.address1.substr(1).toLowerCase() + ' , '
            + this.editClientDetails.address2[0].toUpperCase() + this.editClientDetails.address2.substr(1).toLowerCase());
        } else {
          this.viewClientForm.get('street').setValue(
            this.editClientDetails.address1[0].toUpperCase() + this.editClientDetails.address1.substr(1).toLowerCase());
        }
      }
      if (this.editClientDetails.country) {
        this.viewClientForm.get('country').setValue(this.editClientDetails.country[0].toUpperCase() + this.editClientDetails.country.substr(1).toLowerCase());
      }
      if (this.editClientDetails.state) {
        this.viewClientForm.get('state').setValue(this.editClientDetails.state[0].toUpperCase() + this.editClientDetails.state.substr(1).toLowerCase());
      }
      if (this.editClientDetails.city) {
        this.viewClientForm.get('city').setValue(this.editClientDetails.city[0].toUpperCase() + this.editClientDetails.city.substr(1).toLowerCase());
      }
      if (this.editClientDetails.postalcode) {
        this.viewClientForm.get('postalCode').setValue(this.editClientDetails.postalcode);
      }
      if (this.editClientDetails.orgSuperUser) {
        this.viewClientForm.get('userPhone').setValue(this.editClientDetails.orgSuperUser.phone);
      }
      this.imageLink = this.editClientDetails.imageURL;
    }
  }

  archivedClick() {
    const archiveClientApi = String.Format(this.apiService.archiveClient, this.id, )
    this.apiService.patchData(archiveClientApi).subscribe((response: any) => {
      if (response) {
        this.toast.show('Client Archived', 'Success');
        this.router.navigate(['app/clients/archives']);
      }
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toast.danger(error.error.message, 'Try Again');
      } else {
        this.toast.danger(error, 'Try Again');
      }
    });

  }

  goToEdit() {
    this.router.navigate(['app/clients/edit/' + this.id]);
  }
}

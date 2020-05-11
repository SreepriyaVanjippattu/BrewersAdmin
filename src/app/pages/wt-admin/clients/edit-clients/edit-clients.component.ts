import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiProviderService } from '../../../../core/api-services/api-provider.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PhoneFormatPipe } from '../../../../core/utils/phone-format.pipe';
import { StatusUse } from '../../../../models/status-id-name';
import { NbToastrService } from '@nebular/theme';
import { UtilitiesService } from '../../../../core/utils/utilities.service';
import { String } from "typescript-string-operations";

@Component({
  selector: 'app-edit-clients',
  templateUrl: './edit-clients.component.html',
  styleUrls: ['./edit-clients.component.scss'],
})
export class EditClientsComponent implements OnInit {

  @ViewChild('statusElement', { static: true }) statusElement: ElementRef;
  subStatus: any;
  statusContent: any[];
  phone: any;
  page: string;
  id: any;
  levelNum: number;
  beginDate;
  editClientDetails;
  package;
  formSubmitted = false;
  validEmail = true;
  getTenantContent;
  currentStatus: Number;
  currentStatusText: string;
  tenantList: any[];
  currentStatusValue;
  validPhone = true;
  status = StatusUse;
  minStartDate;
  maxStartDate;
  minExpiryDate;
  maxExpiryDate;
  validUserEmail = true;
  subId: any;
  subName: any;
  validUserPhone = true;
  imageLink = '';
  userProfile: any;
  userId: any;
  error: any = { isError: false, errorMessage: "" };
  constructor(
    private httpService: HttpClient,
    private apiService: ApiProviderService,
    private router: Router,
    private forms: FormBuilder,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private phonePipe: PhoneFormatPipe,
    private toast: NbToastrService,
    private dataTransfer: UtilitiesService,
  ) { }

  clientEditForm = this.forms.group({
    company: [''],
    email: ['', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    startDate: [''],
    expiryDate: [''],
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: [''],
    firstname: ['', Validators.required],
    lastname: [''],
    userEmail: ['', Validators.required],
    userPhone: ['', [Validators.required, Validators.minLength(10)]],
    userId: [''],
    password: [''],
    status: [''],
  });


  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.userProfile = user['userDetails'];
    this.userId = this.userProfile.userId;
    this.id = this.route.snapshot.url[1].path;
    this.page = this.route.snapshot.url[0].path;
    if (this.page === 'edit') {
      this.getAllTenantStatus();
      this.getSingleEditUserDetails(this.id);
    }
  }

  get form() {
    return this.clientEditForm.controls;
  }

  // tenantChange(event: any) {
  //   this.currentStatus = event.target.value;
  //   this.selectedTenant = this.tenantList.find(x => x.Id === this.currentStatus);
  // }

  compareTwoDates() {
    if (
      new Date(this.clientEditForm.get("expiryDate").value) <
      new Date(this.clientEditForm.get("startDate").value)
    ) {
      this.error = { isError: true };
    } else {
      this.error = { isError: false };
    }
  }

  getAllTenantStatus() {

    const status = [
      {
        'Id': '7cd88ffb-cf41-4efc-9a17-d75bcb5b3770',
        'Name': 'Active',
        'status': [
          {
            'Id': '7cd88ffb-cf41-4efc-9a17-d75bcb5b3770',
            'StatusName': 'Active',
          },
          {
            'Id': 'fc7178dd-c5c1-4776-944a-b50fe2c37f06',
            'StatusName': 'Archive',
          },
          {
            'Id': '4d2ba3c3-132e-489f-9c43-47a3996f74fa',
            'StatusName': 'Inactive',
          },
        ],
      },
      {
        'Id': '6e7df31b-5f6a-4029-91e0-5561807164da',
        'Name': 'Pending',
        'status': [
          {
            'Id': '7cd88ffb-cf41-4efc-9a17-d75bcb5b3770',
            'StatusName': 'Active',
          },
          {
            'Id': 'fc7178dd-c5c1-4776-944a-b50fe2c37f06',
            'StatusName': 'Archieve',
          },
          {
            'Id': '1625a5c1-b41a-4f6e-91ad-e4aa0c61121c',
            'StatusName': 'Deleted',
          },
          {
            'Id': '6e7df31b-5f6a-4029-91e0-5561807164da',
            'StatusName': 'Pending',
          },
        ],
      },
      {
        'Id': '4d2ba3c3-132e-489f-9c43-47a3996f74fa',
        'Name': 'Inactive',
        'status': [
          {
            'Id': '7cd88ffb-cf41-4efc-9a17-d75bcb5b3770',
            'StatusName': 'Active',
          },
          {
            'Id': 'fc7178dd-c5c1-4776-944a-b50fe2c37f06',
            'StatusName': 'Archieve',
          },
          {
            'Id': '4d2ba3c3-132e-489f-9c43-47a3996f74fa',
            'StatusName': 'Inactive',
          },
        ],
      },
      {
        'Id': '1625a5c1-b41a-4f6e-91ad-e4aa0c61121c',
        'Name': 'Deleted',
        'status': [],
      },
      {
        'Id': 'fc7178dd-c5c1-4776-944a-b50fe2c37f06',
        'Name': 'Archived',
        'status':
          [
            {
              'Id': '6e7df31b-5f6a-4029-91e0-5561807164da',
              'StatusName': 'Pending',
            },
            {
              'Id': 'fc7178dd-c5c1-4776-944a-b50fe2c37f06',
              'StatusName': 'Archieve',
            },
            {
              'Id': '1625a5c1-b41a-4f6e-91ad-e4aa0c61121c',
              'StatusName': 'Deleted',
            },
          ],
      },
    ];

    this.tenantList = status;

    // const getAllTenant = this.apiService.getData(this.apiService.getAllTenantContent).subscribe((response) => {
    //   this.tenantList = response['body'];
    // })
    // const getAllTenant = this.apiService.getJsonData('assets/json_data/status.json').
    //   subscribe((response) => {
    //   this.tenantList = response['body'];
    // });

  }

  selectedValue() {
    const selectValue = this.selectedValue;
  }

  getSingleEditUserDetails(id) {
    const getClientDetailsbyIdApi = String.Format(this.apiService.getClientDetailById, id);
    this.apiService.getDataList(getClientDetailsbyIdApi, 1, 1, null, null, null).
      subscribe((response) => {
        this.editClientDetails = response['body'];
        this.setDataToEdit();
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          this.toast.danger(error.error.message, 'Try Again');
        } else {
          this.toast.danger(error, 'Try Again');
        }
      });
  }

  setDataToEdit() {
    if (this.editClientDetails) {
      if (this.editClientDetails.subscriptions && this.editClientDetails.subscriptions.length > 0) {
        this.package = this.editClientDetails.subscriptions[0].name;
      }
      if (this.editClientDetails.name) {
        this.clientEditForm.get('company').setValue(this.editClientDetails.name.toUpperCase());
      }
      if (this.editClientDetails.contactEmail) {
        this.clientEditForm.get('email').setValue(this.editClientDetails.contactEmail);
      }
      if (this.editClientDetails.orgSuperUser) {
        if (this.editClientDetails.orgSuperUser.emailAddress) {
          this.clientEditForm.get('userEmail').setValue(this.editClientDetails.orgSuperUser.emailAddress);
        }
        if (this.editClientDetails.contactPhone) {
          this.clientEditForm.get('phone').setValue(this.editClientDetails.contactPhone);
        }
        if (this.editClientDetails.orgSuperUser.phone) {
          this.clientEditForm.get('userPhone').setValue(this.editClientDetails.orgSuperUser.phone);
        }
        if (this.editClientDetails.startDate) {
          this.clientEditForm.get('startDate').setValue(this.editClientDetails.startDate);
          if (this.editClientDetails.systemSetting[0]) {
            const createdDate = this.editClientDetails.systemSetting[0].createdDate;
            this.minStartDate = createdDate;
            this.maxStartDate = this.editClientDetails.endDate;
          }
        }
        if (this.editClientDetails.endDate) {
          this.clientEditForm.get('expiryDate').setValue(this.editClientDetails.endDate);
          this.minExpiryDate = this.clientEditForm.get("startDate").value;
        }
        if (this.editClientDetails.orgSuperUser.firstName) {
          this.clientEditForm.get('firstname').setValue(this.editClientDetails.orgSuperUser.firstName);
        }
        if (this.editClientDetails.orgSuperUser.lastName) {
          this.clientEditForm.get('lastname').setValue(this.editClientDetails.orgSuperUser.lastName);
        }
      }

      if (this.editClientDetails.address1) {
        if (this.editClientDetails.address2) {
          this.clientEditForm.get('street').setValue(
            this.editClientDetails.address1[0].toUpperCase() + this.editClientDetails.address1.substr(1).toLowerCase() + ' , '
            + this.editClientDetails.address2[0].toUpperCase() + this.editClientDetails.address2.substr(1).toLowerCase());
        } else {
          this.clientEditForm.get('street').setValue(
            this.editClientDetails.address1[0].toUpperCase() + this.editClientDetails.address1.substr(1).toLowerCase());
        }
      }
      if (this.editClientDetails.country) {
        this.clientEditForm.get('country').setValue(
          this.editClientDetails.country[0] + this.editClientDetails.country.substr(1).toLowerCase());
      }
      if (this.editClientDetails.state) {
        this.clientEditForm.get('state').setValue(
          this.editClientDetails.state[0].toUpperCase() + this.editClientDetails.state.substr(1).toLowerCase());
      }
      if (this.editClientDetails.city) {
        this.clientEditForm.get('city').setValue(
          this.editClientDetails.city[0].toUpperCase() + this.editClientDetails.city.substr(1).toLowerCase());
      }
      if (this.editClientDetails.postalcode) {
        this.clientEditForm.get('postalCode').setValue(this.editClientDetails.postalcode);
      }
      if (this.editClientDetails.orgSuperUser !== null) {
        this.clientEditForm.get('userPhone').setValue(this.editClientDetails.orgSuperUser.phone);
      }
      this.tenantList.map((element: any) => {
        if (element.Id === this.editClientDetails.status) {
          this.subStatus = element.status;
        }
      });
      this.clientEditForm.get('status').setValue(this.editClientDetails.status);
      if (this.dataTransfer.key && this.dataTransfer.value) {
        this.subId = this.dataTransfer.key;
        this.subName = this.dataTransfer.value;
        this.dataTransfer.key = '';
        this.dataTransfer.value = '';
      } else if (this.editClientDetails.subscriptions && this.editClientDetails.subscriptions.length > 0) {
        this.subId = this.editClientDetails.subscriptions[0].id;
        this.subName = this.editClientDetails.subscriptions[0].name;
      }
      this.clientEditForm.get('userEmail').disable();
      this.imageLink = this.editClientDetails.imageURL;
    }
  }


  saveForm() {
    if (this.clientEditForm.valid) {
      const str_client = this.clientEditForm.value.street.split(',');
      const select = this.statusElement.nativeElement;
      const statusText = select.options[select.selectedIndex].value;

      const paramsClient = {
        id: this.editClientDetails.id,
        name: this.editClientDetails.name,
        companyAlias: this.editClientDetails.companyAlias,
        contactEmail: this.clientEditForm.get('email').value,
        contactPhone: this.clientEditForm.get('phone').value,
        address1: str_client[0],
        address2: str_client[1],
        state: this.clientEditForm.get('state').value,
        country: this.clientEditForm.get('country').value,
        city: this.clientEditForm.get('city').value,
        postalcode: this.clientEditForm.get('postalCode').value,
        imageURL : this.editClientDetails.imageURL,
        isActive: true,
        status: statusText,
        modifiedDate: this.editClientDetails.modifiedDate,
      };
      if (this.editClientDetails.orgSuperUser.roles && this.editClientDetails.orgSuperUser.roles.length > 0) {
        var paramsUser = {
          id: this.editClientDetails.orgSuperUser.id,
          firstName: this.clientEditForm.get('firstname').value,
          middleName: '',
          lastName: this.clientEditForm.get('lastname').value,
          emailAddress: this.clientEditForm.get('userEmail').value,
          phone: this.clientEditForm.get('userPhone').value,
          userName: this.clientEditForm.get('userEmail').value,
          password: this.editClientDetails.orgSuperUser.password,
          createdDate: this.editClientDetails.orgSuperUser.createdDate,
          modifiedDate: this.editClientDetails.orgSuperUser.modifiedDate,
          isActive: this.editClientDetails.orgSuperUser.isActive,
          imageUrl: this.editClientDetails.orgSuperUser.imageURL,
          position: this.editClientDetails.orgSuperUser.position,
          statusId: this.editClientDetails.orgSuperUser.statusId,
          tenantId: this.id,
          roles: [{
            id: this.editClientDetails.orgSuperUser.roles[0].id,
          }],
        };
      }
      if (this.editClientDetails.systemSetting && this.editClientDetails.systemSetting.length > 0) {
        var paramSettings = {

          id: this.editClientDetails.systemSetting[0].id,
          name: this.editClientDetails.systemSetting[0].name,
          emailSettingId: this.editClientDetails.systemSetting[0].emailSettingId,
          subscriptionId: this.editClientDetails.systemSetting[0].subscriptionId,
          tenantId: this.editClientDetails.systemSetting[0].tenantId,
          modifiedDate: this.editClientDetails.systemSetting[0].modifiedDate,
          startDate:(new Date(this.clientEditForm.get('startDate').value)).toLocaleString(),
          endDate: (new Date(this.clientEditForm.get('expiryDate').value)).toLocaleString(),
          subscriptionEmail: this.clientEditForm.get('email').value,
          supportEmail: this.clientEditForm.get('email').value,
        };
      }
      this.editClient(paramsClient, paramsUser, paramSettings);
    }
  }

  editClient(paramsClient, paramsUser, paramSettings) {
    const editClientApi = String.Format(this.apiService.editClient,this.editClientDetails.id );
    this.apiService.putData(editClientApi, paramsClient).subscribe(response => {
      if (response) {
        this.editSubscriptions(paramSettings, paramsUser);
      }
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toast.danger(error.error.message, 'Try Again');
      } else {
        this.toast.danger(error, 'Try Again');
      }
    });
  }

  editSubscriptions(paramSettings, paramsUser) {
    this.apiService.putData(this.apiService.editClientSettings, paramSettings).subscribe(response => {
      if (response) {
        this.editUser(paramsUser);
      }
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toast.danger(error.error.message, 'Try Again');
      } else {
        this.toast.danger(error, 'Try Again');
      }
    });
  }

  editUser(user) {
    const editUserApi = String.Format(this.apiService.editUser, this.editClientDetails.id)
    this.apiService.putData(editUserApi, user).subscribe((response: any) => {
      if (response) {
        this.toast.success('Client Edited', 'Success');
        this.router.navigate(['app/clients']);
      }
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        this.toast.danger(error.error.message, 'Try Again');
      } else {
        this.toast.danger(error, 'Try Again');
      }
    });
  }


  emailvalidation(email) {

    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailReg.test(email)) {
      if (email === this.clientEditForm.get('email').value) {
        this.validEmail = false;
      }
      if (email === this.clientEditForm.get('userEmail').value) {
        this.validUserEmail = false;
      }
    } else {
      this.validEmail = true;
      this.validUserEmail = true;
    }
  }

  formatPhone() {
    if (this.clientEditForm.get('phone').errors) {
      this.validPhone = false;
    } else {
      this.validPhone = true;
    }
  }

  formatUserPhone() {
    if (this.clientEditForm.get('userPhone').errors) {
      this.validUserPhone = false;
    } else {
      this.validUserPhone = true;
    }
  }

  archivedClick() {
    const clientForm = this.clientEditForm.controls;
    const str_client = this.clientEditForm.value.street.split(',');
    const params = {
      Id: this.id,
      Name: clientForm.company.value,
      ContactEmail: clientForm.email.value,
      ContactPhone: clientForm.phone.value,
      Address1: str_client[0],
      Address2: str_client[1],
      State: clientForm.state.value,
      Country: clientForm.country.value,
      City: clientForm.city.value,
      Postalcode: clientForm.postalCode.value,
      IsActive: true,
      Status: this.status.archive.name,
      StatusId: this.status.archive.id,
      CurrentUser: this.userId,
      Subscriptions: [
        {
          Id: this.editClientDetails.Subscriptions[0].Id,
          StartDate: this.clientEditForm.get('startDate').value,
          EndDate: this.clientEditForm.get('expiryDate').value,
        },
      ],
    };
    this.apiService.putData(this.apiService.editClient, params).subscribe(response => {
      if (response) {
        this.toast.show('Client Archived', 'Success');
        this.router.navigate(['app/clients/archives']);
      }
    }, error => {
      this.toast.danger(error.error.Message);
    });

  }

  clientSave() {
    this.formSubmitted = true;
    this.saveForm();
  }

  subscriptionPlanClick() {
    this.router.navigate(['app/clients/subscription/' + this.id]);
  }

  startDateChange() {
    this.minExpiryDate = this.clientEditForm.get('startDate').value;
  }

  expiryDateChange() {
    this.maxStartDate = this.clientEditForm.get('expiryDate').value;
  }
}

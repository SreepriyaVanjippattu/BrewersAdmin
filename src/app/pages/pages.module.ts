import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AuthGaurdService } from '../core/guards/auth-gaurd.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { RoleGaurdService } from '../core/guards/role-gaurd.service';
import {Constants} from '../models/constants';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
     /** wt-admin routes */
     {
      path: 'clients',
      loadChildren: () => import('../pages/wt-admin/clients/clients.module')
        .then(m => m.ClientsModule),

      canActivateChild: [RoleGaurdService, AuthGaurdService],
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
        expectedPermission: ['Delete Organization'],
      },

    },
    {
      path: 'reports-admin',
      loadChildren: () => import('../pages/wt-admin/reports-admin/reports-admin.module')
        .then(m => m.ReportsAdminModule),
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
      },
    },
    {
      path: 'user-directory-admin',
      loadChildren: () => import('../pages/wt-admin/user-directory/user-directory.module')
        .then(m => m.UserDirectoryModule),
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
      },
    },
    {
      path: 'settings',
      loadChildren: () => import('../pages/wt-admin/settings/settings.module')
        .then(m => m.SettingsModule),
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
      },
    },
    {
      path: 'profile-wt-admin',
      loadChildren: () => import('../pages/wt-admin/profile-super-admin/profile-super-admin.module')
        .then(m => m.ProfileSuperAdminModule),
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
      },
    },
    {
      path: 'role-privileges',
      loadChildren: () => import('../pages/wt-admin/role-privileges-super-admin/role-privileges-super-admin.module')
        .then(m => m.RolePrivilegesSuperAdminModule),
      canActivate: [RoleGaurdService, AuthGaurdService],
      data: {
        expectedRole: [Constants.Superadmin],
      },
    },
    /** wt-admin routes */

  ],
}];

@NgModule({
  imports: [
    SharedModule,
    NbMenuModule,
    NgIdleKeepaliveModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    PagesComponent,
  ],
  exports: [RouterModule]
})
export class PagesModule {
  
}

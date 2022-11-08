import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import {
  DxAccordionModule,
  DxCheckBoxModule,
  DxDataGridModule, DxDiagramModule, DxFilterBuilderModule,
  DxFormModule, DxGanttModule, DxSliderModule, DxTagBoxModule,
  DxTemplateModule, DxTreeListModule, DxTreeViewModule
} from 'devextreme-angular';
import {PanelsComponent} from "./pages/pannels/panels.component";
import {BrowserModule} from "@angular/platform-browser";
import {PanelService} from "./shared/services/panel.service";
import {GoldenLayoutHostComponent} from "./layouts/golden-layout/golden-layout-host.component";
import {GoldenLayoutComponentService} from "./layouts/golden-layout/golden-layout-component.service";
import {GoldenControlsComponent} from "./layouts/golden-layout/controls.component";
import {TreeViewComponent} from "./pages/pannels/components/tree-view/tree-view.component";
import {FilterBuilderComponent} from "./pages/pannels/components/filter-builder/filter-builder.component";
import {DiagramComponent} from "./pages/pannels/components/diagram/diagram.component";
import {GanttComponent} from "./pages/pannels/components/gantt/gantt.component";
import {TreeListComponent} from "./pages/pannels/components/tree-list/tree-list.component";

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'panels',
    component: PanelsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule,
    DxDataGridModule,
    DxFormModule,
    DxAccordionModule,
    DxTemplateModule,
    BrowserModule,
    DxTemplateModule,
    DxCheckBoxModule,
    DxTreeViewModule,
    DxFilterBuilderModule,
    DxDiagramModule,
    DxTreeListModule,
    DxGanttModule,
  ],
  providers: [
    AuthGuardService,
    PanelService,
    GoldenLayoutComponentService
  ],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TasksComponent,
    PanelsComponent,
    TreeViewComponent,
    DiagramComponent,
    GanttComponent,
    TreeListComponent,
    FilterBuilderComponent,
    GoldenLayoutHostComponent,
    GoldenControlsComponent
  ]
})
export class AppRoutingModule { }

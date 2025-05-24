import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { projectsPage } from './projects.page';

const routes: Routes = [
  {
    path: '',
    component: projectsPage
  },  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class projectsPageRoutingModule {}

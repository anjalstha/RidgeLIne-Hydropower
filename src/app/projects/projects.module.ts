import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { projectsPageRoutingModule } from './projects-routing.module';

import { projectsPage } from './projects.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    projectsPageRoutingModule
  ],
  declarations: [projectsPage]
})
export class projectsPageModule {}

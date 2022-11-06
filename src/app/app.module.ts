import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { StudentComponent } from './pages/student/student.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { CreateClassComponent } from './pages/create-class/create-class.component';
import { AuthComponent } from './pages/auth/auth.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ManageComponent } from './pages/manage/manage.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzDividerModule} from "ng-zorro-antd/divider";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {NzResultModule} from "ng-zorro-antd/result";
import { NzMessageModule } from 'ng-zorro-antd/message';
import { VerifyComponent } from './pages/verify/verify.component';
import {NzMenuModule} from "ng-zorro-antd/menu";
import { NzIconModule } from 'ng-zorro-antd/icon';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    InstructorComponent,
    CreateClassComponent,
    AuthComponent,
    ManageComponent,
    NotFoundComponent,
    VerifyComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NzButtonModule,
        NzCardModule,
        NzSelectModule,
        NzTabsModule,
        NzTableModule,
        NzLayoutModule,
        NzNotificationModule,
        NzDividerModule,
        NzGridModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        NzInputModule,
        NzModalModule,
        NzResultModule,
        NzMessageModule,
        NzMenuModule,
        NzIconModule,
        NzToolTipModule
    ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

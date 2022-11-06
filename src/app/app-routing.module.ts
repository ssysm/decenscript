import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { CreateClassComponent } from './pages/create-class/create-class.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { ManageComponent } from './pages/manage/manage.component';
import { StudentComponent } from './pages/student/student.component';
import {NotFoundComponent} from "./pages/not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'student',
    component: StudentComponent
  },
  {
    path: 'instructor',
    component: InstructorComponent
  },
  {
    path: 'create-class',
    component: CreateClassComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'manage',
    component: ManageComponent
  },
  {
    path:'404',
    component: NotFoundComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

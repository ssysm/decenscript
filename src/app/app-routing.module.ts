import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { CreateClassComponent } from './pages/create-class/create-class.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { StudentComponent } from './pages/student/student.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

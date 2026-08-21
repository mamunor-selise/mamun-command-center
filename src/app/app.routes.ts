import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RoutineComponent } from './features/routine/routine.component';
import { CvManagementComponent } from './features/cv-management/cv-management.component';
import { QuizTestComponent } from './features/quiz-test/quiz-test.component';
import { VaultPageComponent } from './features/vault/vault-page.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'routine', component: RoutineComponent },
  { path: 'cv-management', component: CvManagementComponent },
  { path: 'quiz-test', component: QuizTestComponent },
  { path: 'vault', component: VaultPageComponent },
  { path: '**', redirectTo: '' }
];

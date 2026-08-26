import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RoutineComponent } from './features/routine/routine.component';
import { CvManagementComponent } from './features/cv-management/cv-management.component';
import { QuizTestComponent } from './features/quiz-test/quiz-test.component';
import { VaultPageComponent } from './features/vault/vault-page.component';
import { QueryBuilderComponent } from './features/query-builder/query-builder.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'routine', component: RoutineComponent },
  { path: 'cv-management', component: CvManagementComponent },
  { path: 'quiz-test', component: QuizTestComponent },
  { path: 'query-builder', component: QueryBuilderComponent },
  { path: 'confidential-secrets', component: VaultPageComponent },
  { path: '**', redirectTo: '' }
];

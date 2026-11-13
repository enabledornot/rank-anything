import { Routes } from '@angular/router';
import { Lists } from './lists/lists';
import { Home } from './home/home';
export const routes: Routes = [
    { path: '', component: Home},
    { path: 'lists', component: Lists }
];

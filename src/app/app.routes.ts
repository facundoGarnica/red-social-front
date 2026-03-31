import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PostsComponent } from './posts/posts.component';

export const routes: Routes = [
    { 
        path: 'inicio', 
        component: InicioComponent,
        children: [
            { path: '', component: PostsComponent }
        ]
    },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];

import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PostsComponent } from './posts/posts.component';
import { CrearPostComponent } from './crear-post/crear-post.component';
export const routes: Routes = [
    { 
        path: 'inicio', 
        component: InicioComponent,
        children: [
            { path: '', component: PostsComponent },
            { path: 'new-post', component: CrearPostComponent }
        ]
    },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];

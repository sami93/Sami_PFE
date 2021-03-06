import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AuthGuardLogin} from './services/auth-guard-login.service';
import {sopraDescriptionModule} from "./sopraDescription/sopraDescription.module";

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'pages/login',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuardLogin],
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'account',
                loadChildren: './account/account.module#AccountModule'
            },
            {
            path: '',
            loadChildren: './description/description.module#descriptionModule'
          },
          {
            path: '',
            loadChildren: './sopraDescription/sopraDescription.module#sopraDescriptionModule'
          },

            {
                path: 'components',
                loadChildren: './components/components.module#ComponentsModule'
            },
            {
                path: 'forms',
                loadChildren: './forms/forms.module#Forms'
            }, {
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule'
            }, {
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule'
            }, {
                path: 'widgets',
                loadChildren: './widgets/widgets.module#WidgetsModule'
            }, {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            }, {
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule'
            }, {
                path: '',
                loadChildren: './userpage/user.module#UserModule'
            }, {
                path: '',
                loadChildren: './timeline/timeline.module#TimelineModule'
            }
        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];

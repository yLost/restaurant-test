import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import App from "./app";

import Kitchen from './pages/kitchen/kitchen';
import Attendant from './pages/attendant/attendant';
import AttendantTable from './pages/attendant/table/table';
import AttendantProducts from './pages/attendant/products/products';
import Login from './pages/login/login';

const routes: Routes = [
    { path: "kitchen", component: Kitchen },
    { path: "attendant", component: Attendant },
    { path: "login", component: Login },
    { path: "**", pathMatch: "full", redirectTo: "login" }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
    ],
    declarations: [
        App,

        Kitchen,
        Login,
        Attendant,
        AttendantTable,
        AttendantProducts,
    ],
    providers: [],
    bootstrap: [App]
})
export class AppModule { }

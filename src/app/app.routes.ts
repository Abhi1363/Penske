import { Routes } from '@angular/router';
import { Component1 } from '../components/component-1/component-1';
import { ChildComp } from '../components/child-comp/child-comp';
import { SecondChildComp } from '../components/second-child-comp/second-child-comp';
import { ThirdChildComp } from '../components/third-child-comp/third-child-comp';
import { FourthChildComp } from '../components/fourth-child-comp/fourth-child-comp';

export const routes: Routes = [
    { path: '', redirectTo: 'component-1', pathMatch: 'full' },
    { path: 'component-1', component: Component1 },
    { path: 'child-comp', component: ChildComp },
    { path: 'child-second', component: SecondChildComp },
    { path: 'child-third', component: ThirdChildComp },
    { path: 'child-fourth', component: FourthChildComp },
];

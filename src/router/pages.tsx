import { lazy } from 'react'
import Loadable from './loadable'


export const PagePet = Loadable(lazy(() => import('../pages/pet/index')))
export const PageDashboard = Loadable(lazy(() => import('../pages/dashboard/index')))



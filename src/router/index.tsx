import { useRoutes } from 'react-router-dom'
import { PagePet, PageDashboard } from './pages'


export default function Router() {
  const routers = [
    {
      path: '/',
      element: <PagePet />
    },
    {
      path: '/pet',
      element: <PagePet />
    },
    {
      path: '/dashboard',
      element: <PageDashboard />
    }
  ]

  return useRoutes(routers)
}
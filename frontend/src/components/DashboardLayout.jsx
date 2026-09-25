import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  return (
    <div className="dash-layout">
      <Sidebar />
      <div className="dash-content">
        <Topbar />
        <main className="dash-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

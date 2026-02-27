import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import { Toaster } from "./components/ui/toaster"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        
        {/* Header */}
        <header className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            
            {/* App title */}
            <span className="text-lg font-semibold tracking-tight text-foreground">
              HRMS Lite
            </span>

            {/* Navigation */}
            <nav className="flex items-center gap-5">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-sm transition ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Employees
              </NavLink>

              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `text-sm transition ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Attendance
              </NavLink>
            </nav>

          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>

      <Toaster />
    </BrowserRouter>
  )
}
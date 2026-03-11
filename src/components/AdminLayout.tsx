import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Palette, Rocket } from "lucide-react";

/**
 * Layout for admin portal: header nav + outlet for /admin, /admin/customers, /admin/customers/:id, /admin/registry-editor.
 */
export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-background px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link to="/admin" className="font-display text-lg font-semibold text-primary">
            Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </NavLink>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Users className="h-4 w-4" />
              Customers
            </NavLink>
            <NavLink
              to="/admin/registry-editor"
              className={({ isActive }) =>
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Palette className="h-4 w-4" />
              Registry Editor
            </NavLink>
            <Link
              to="/coming-soon"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Rocket className="h-4 w-4" />
              Coming Soon
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

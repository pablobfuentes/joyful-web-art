import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Palette } from "lucide-react";

/**
 * Layout for admin portal: sidebar nav + outlet for /admin, /admin/customers, /admin/customers/:id.
 * Registry Editor stays full-page at /admin/registry-editor (linked from here).
 */
export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b bg-background px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/admin" className="font-display text-lg font-semibold text-primary">
            Admin
          </Link>
          <nav className="flex items-center gap-1">
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
            <Link
              to="/admin/registry-editor"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Palette className="h-4 w-4" />
              Registry Editor
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

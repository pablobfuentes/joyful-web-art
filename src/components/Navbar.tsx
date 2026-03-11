import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/** Ensures nav/footer links are always an array (handles object shape from registry or localStorage). */
function ensureLinks(
  x: unknown
): Array<{ label?: string; href?: string }> {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object" && !Array.isArray(x))
    return Object.values(x) as Array<{ label?: string; href?: string }>;
  return [];
}

const navLinkClass =
  "px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("nav");
  const dashboardData = getSectionContent("dashboard");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Cuenta";

  const links = ensureLinks(data?.links);
  const logIn = data?.logIn && typeof data.logIn === "object" ? data.logIn : { label: "Iniciar sesion", href: "/login" };
  const getStarted = data?.getStarted && typeof data.getStarted === "object" ? data.getStarted : { label: "Registrarme", href: "/register" };

  async function handleLogOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md"
    >
      <div className="gradient-warm text-primary-foreground text-center py-1.5 text-xs font-semibold tracking-wide">
        {data?.announcementBarEmoji ?? "🎉"} {data?.announcementBar ?? ""}
      </div>

      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {data?.logoEmoji ?? "🦊"}
          </motion.span>
          <span className="font-display text-2xl font-bold text-gradient">
            {data?.logoText ?? ""}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((item, i) => (
            <a key={item?.label ?? i} href={item?.href ?? "#"} className={navLinkClass}>
              {item?.label ?? ""}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <span className="px-4 py-2 text-sm text-muted-foreground">...</span>
          ) : user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300"
              >
                {displayName}
              </Link>
              <button
                type="button"
                onClick={handleLogOut}
                className="px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300"
              >
                {typeof dashboardData?.logOut === "string" ? dashboardData.logOut : "Cerrar sesion"}
              </button>
            </>
          ) : (
            <>
              <Link
                to={logIn.href ?? "/login"}
                className="px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300"
              >
                {logIn.label ?? "Iniciar sesion"}
              </Link>
              <motion.div whileHover={{ scale: 1.08, rotate: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={getStarted.href ?? "/register"}
                  className="gradient-warm px-6 py-2.5 rounded-[var(--nav-cta-radius)] text-sm font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow inline-block"
                >
                  {getStarted.label ?? "Registrarme"}
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile menu: hamburger + sheet */}
        <div className="md:hidden flex items-center">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground" aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,100vw-2rem)] flex flex-col pt-8">
              <nav className="flex flex-col gap-1">
                {links.map((item, i) => (
                  <a
                    key={item?.label ?? i}
                    href={item?.href ?? "#"}
                    className={`${navLinkClass} py-3 min-h-[44px] flex items-center`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item?.label ?? ""}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t flex flex-col gap-2">
                {loading ? (
                  <span className="px-4 py-3 text-sm text-muted-foreground">...</span>
                ) : user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`${navLinkClass} py-3 min-h-[44px] flex items-center`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {displayName}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogOut();
                      }}
                      className={`${navLinkClass} py-3 min-h-[44px] text-left w-full flex items-center`}
                    >
                      {typeof dashboardData?.logOut === "string" ? dashboardData.logOut : "Cerrar sesion"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={logIn.href ?? "/login"}
                      className={`${navLinkClass} py-3 min-h-[44px] flex items-center`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {logIn.label ?? "Iniciar sesion"}
                    </Link>
                    <Link
                      to={getStarted.href ?? "/register"}
                      className="gradient-warm px-6 py-3 rounded-[var(--nav-cta-radius)] text-sm font-bold text-primary-foreground shadow-playful min-h-[44px] flex items-center justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      {getStarted.label ?? "Registrarme"}
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";

/** Ensures nav/footer links are always an array (handles object shape from registry or localStorage). */
function ensureLinks(
  x: unknown
): Array<{ label?: string; href?: string }> {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object" && !Array.isArray(x))
    return Object.values(x) as Array<{ label?: string; href?: string }>;
  return [];
}

const Navbar = () => {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("nav");
  const dashboardData = getSectionContent("dashboard");
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Account";

  const links = ensureLinks(data?.links);
  const logIn = data?.logIn && typeof data.logIn === "object" ? data.logIn : { label: "Log in", href: "/login" };
  const getStarted = data?.getStarted && typeof data.getStarted === "object" ? data.getStarted : { label: "Get started", href: "/register" };

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

      <div className="container mx-auto flex items-center justify-between py-3 px-6">
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
            <a
              key={item?.label ?? i}
              href={item?.href ?? "#"}
              className="px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300"
            >
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
                {typeof dashboardData?.logOut === "string" ? dashboardData.logOut : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link
                to={logIn.href ?? "/login"}
                className="px-4 py-2 rounded-[var(--nav-cta-radius)] text-sm font-semibold text-[hsl(var(--nav-link-color))] hover:bg-[hsl(var(--nav-link-hover-bg))] hover:text-[hsl(var(--nav-link-hover-text))] transition-all duration-300"
              >
                {logIn.label ?? "Log in"}
              </Link>
              <motion.div whileHover={{ scale: 1.08, rotate: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={getStarted.href ?? "/register"}
                  className="gradient-warm px-6 py-2.5 rounded-[var(--nav-cta-radius)] text-sm font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow inline-block"
                >
                  {getStarted.label ?? "Get started"}
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

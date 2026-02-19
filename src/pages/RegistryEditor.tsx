import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

/**
 * RegistryEditor – admin page to edit style and text variables.
 * Route: /admin/registry-editor (protected by AdminRoute; requires profiles.role = 'admin').
 * Full UI (General tab, section tabs, palette matrix, Save/Reset) in Phase 3.2–3.5.
 */
const RegistryEditor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12 px-6 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Registry Editor</h1>
        <p className="text-muted-foreground mb-6">
          Edit style and text variables for the site. Admin only. Full editor UI (General tab with
          color palette matrix, section tabs with previews, Save/Reset, localStorage) is in progress.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
};

export default RegistryEditor;

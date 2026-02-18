import { APP_REGISTRY } from "@/config/app-registry";

const data = APP_REGISTRY.footer;

const FooterSection = () => {
  return (
    <footer className="bg-background border-t border-border py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="font-display font-bold text-foreground mb-2">{data.mission.title}</h3>
            <p className="text-sm text-muted-foreground">{data.mission.description}</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-3">{data.navigate.title}</h3>
            <ul className="space-y-2">
              {data.navigate.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-3">{data.connect.title}</h3>
            <ul className="space-y-2">
              {data.connect.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-3">{data.newsletter.title}</h3>
            <input
              type="email"
              placeholder={data.newsletter.placeholder}
              className="w-full px-4 py-2 rounded-full border-2 border-border bg-background text-sm"
            />
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{data.bottomBar.copyright}</p>
          <div className="flex gap-6">
            {data.bottomBar.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

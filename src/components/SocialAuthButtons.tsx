import type { OAuthProvider } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SocialAuthButtonsProps = {
  dividerText: string;
  googleLabel: string;
  facebookLabel: string;
  showFacebook?: boolean;
  disabled?: boolean;
  onProviderClick: (provider: OAuthProvider) => void;
};

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      data-testid="google-logo"
      viewBox="0 0 24 24"
      className="h-4 w-4"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.16 3.58-8.64Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.95H1.27v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.26 14.29A7.19 7.19 0 0 1 4.88 12c0-.79.14-1.56.38-2.29V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.33.61 4.57 1.8l3.43-3.43C17.94 1.14 15.24 0 12 0A12 12 0 0 0 1.27 6.62l3.99 3.09C6.21 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

export default function SocialAuthButtons({
  dividerText,
  googleLabel,
  facebookLabel,
  showFacebook = true,
  disabled = false,
  onProviderClick,
}: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{dividerText}</span>
        <Separator className="flex-1" />
      </div>

      <div className={`grid gap-3 ${showFacebook ? "sm:grid-cols-2" : ""}`}>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onProviderClick("google")}
        >
          <GoogleLogo />
          {googleLabel}
        </Button>
        {showFacebook ? (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onProviderClick("facebook")}
          >
            {facebookLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

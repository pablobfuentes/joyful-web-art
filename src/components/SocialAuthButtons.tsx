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

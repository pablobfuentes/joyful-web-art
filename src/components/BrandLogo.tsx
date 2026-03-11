import { resolveRegistryImageSrc } from "@/lib/registry-images";

const DEFAULT_LOGO_SRC = "/Logo sin BG.png";

type BrandLogoProps = {
  name: string;
  imagePath?: string;
  className?: string;
};

export default function BrandLogo({ name, imagePath, className }: BrandLogoProps) {
  const src = resolveRegistryImageSrc(imagePath, DEFAULT_LOGO_SRC);

  return <img src={src} alt={`${name} logo`} className={className} />;
}

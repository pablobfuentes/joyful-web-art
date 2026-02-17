const WaveDivider = ({
  topColor = "hsl(var(--background))",
  bottomColor = "hsl(var(--peach))",
  variant = "wave1",
  flip = false,
}: {
  topColor?: string;
  bottomColor?: string;
  variant?: "wave1" | "wave2" | "blob" | "zigzag";
  flip?: boolean;
}) => {
  const paths: Record<string, string> = {
    wave1: "M0,64 C200,120 400,0 600,64 C800,128 1000,20 1200,64 L1200,150 L0,150 Z",
    wave2: "M0,80 C150,20 300,100 500,60 C700,20 900,110 1200,50 L1200,150 L0,150 Z",
    blob: "M0,100 C100,40 200,120 350,60 C500,0 600,100 750,70 C900,40 1050,100 1200,60 L1200,150 L0,150 Z",
    zigzag: "M0,80 L100,40 L200,80 L300,40 L400,80 L500,40 L600,80 L700,40 L800,80 L900,40 L1000,80 L1100,40 L1200,80 L1200,150 L0,150 Z",
  };

  return (
    <div
      className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}
      style={{ marginTop: "-1px", marginBottom: "-1px" }}
    >
      <svg
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        className="relative block w-full h-[80px] md:h-[120px]"
      >
        <rect width="1200" height="150" fill={topColor} />
        <path d={paths[variant]} fill={bottomColor} />
      </svg>
    </div>
  );
};

export default WaveDivider;

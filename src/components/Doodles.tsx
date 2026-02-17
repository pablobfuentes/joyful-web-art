import { motion } from "framer-motion";

// Skincare-themed hand-drawn style SVG doodles
export const DoodleDroplet = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 50" fill="none" className={className}>
    <path
      d="M20 4C20 4 6 22 6 32C6 40 12 46 20 46C28 46 34 40 34 32C34 22 20 4 20 4Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M15 28C15 28 13 32 15 35"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export const DoodleSparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path
      d="M20 2L23 15L36 12L25 20L36 28L23 25L20 38L17 25L4 28L15 20L4 12L17 15L20 2Z"
      fill="currentColor"
    />
  </svg>
);

export const DoodleLeaf = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 50 50" fill="none" className={className}>
    <path
      d="M8 42C8 42 10 20 30 8C30 8 38 18 35 35C32 45 18 48 8 42Z"
      fill="currentColor"
      opacity="0.85"
    />
    <path
      d="M12 38C14 30 20 20 30 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

export const DoodleHeart = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 44 40" fill="none" className={className}>
    <path
      d="M22 38C22 38 2 26 2 14C2 8 7 3 13 3C17 3 20 5 22 8C24 5 27 3 31 3C37 3 42 8 42 14C42 26 22 38 22 38Z"
      fill="currentColor"
    />
  </svg>
);

export const DoodleFlower = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 50 50" fill="none" className={className}>
    <circle cx="25" cy="25" r="6" fill="currentColor" opacity="0.9" />
    <ellipse cx="25" cy="12" rx="6" ry="9" fill="currentColor" opacity="0.5" />
    <ellipse cx="25" cy="38" rx="6" ry="9" fill="currentColor" opacity="0.5" />
    <ellipse cx="12" cy="25" rx="9" ry="6" fill="currentColor" opacity="0.5" />
    <ellipse cx="38" cy="25" rx="9" ry="6" fill="currentColor" opacity="0.5" />
    <ellipse cx="16" cy="16" rx="6" ry="9" fill="currentColor" opacity="0.4" transform="rotate(-45 16 16)" />
    <ellipse cx="34" cy="34" rx="6" ry="9" fill="currentColor" opacity="0.4" transform="rotate(-45 34 34)" />
    <ellipse cx="34" cy="16" rx="6" ry="9" fill="currentColor" opacity="0.4" transform="rotate(45 34 16)" />
    <ellipse cx="16" cy="34" rx="6" ry="9" fill="currentColor" opacity="0.4" transform="rotate(45 16 34)" />
  </svg>
);

export const DoodleStar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path
      d="M20 4L24 16L36 16L26 24L30 36L20 28L10 36L14 24L4 16L16 16L20 4Z"
      fill="currentColor"
    />
  </svg>
);

// Animated floating doodle wrapper
export const FloatingDoodle = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -3, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

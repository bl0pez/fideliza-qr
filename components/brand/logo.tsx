import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 32, className, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Image
        src="/logo.svg"
        alt="Fidelilocal"
        width={size}
        height={size}
        priority
        className="shrink-0"
      />
      {showText && (
        <span
          style={{ fontSize: size * 0.6 }}
          className="font-bold tracking-tight text-slate-900 dark:text-white leading-none"
        >
          Fidelilocal
        </span>
      )}
    </div>
  );
}

type LogoProps = {
  light?: boolean;
  logoName: string;
  logoSub: string;
  agentName: string;
};

export function Logo({
  light = false,
  logoName,
  logoSub,
  agentName,
}: LogoProps) {
  return (
    <a
      className={`logo ${light ? "logo--light" : ""}`}
      href="/"
      aria-label={`${agentName} home`}
    >
      <span className="logo__name">{logoName}</span>
      <span className="logo__sub">{logoSub}</span>
    </a>
  );
}

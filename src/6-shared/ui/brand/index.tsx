type BrandProps = {
  className?: string;
};

export function Brand({ className = "" }: BrandProps) {
  return (
    <a className={`brand ${className}`.trim()} href="#top" aria-label="Srce dobrote — početna">
      <span className="brand-mark" aria-hidden="true">♥</span>
      <span>Srce dobrote</span>
    </a>
  );
}

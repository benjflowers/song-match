type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingProps = {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
};

const sizeMap: Record<HeadingLevel, string> = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-medium',
};

export function Heading({ level = 'h1', children, className = '' }: HeadingProps) {
  const Tag = level;
  return <Tag className={`${sizeMap[level]} ${className}`}>{children}</Tag>;
}

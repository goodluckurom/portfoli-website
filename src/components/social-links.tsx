import Link from 'next/link';
import { Icons } from '@/components/icons';
import type { SocialLink } from '@prisma/client';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

export function SocialLinks({ links, className = '' }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons name={link.icon.toLowerCase()} className="h-5 w-5" />
          <span className="sr-only">{link.name}</span>
        </Link>
      ))}
    </div>
  );
}

import Link from 'next/link';
import { Icons } from '@/components/icons';
import type { SocialLink } from '@prisma/client';
import type { IconName } from '@/components/icons';
import { SocialPlatform } from '@prisma/client';

const socialPlatformIcons: Record<SocialPlatform, IconName> = {
  [SocialPlatform.GITHUB]: 'github',
  [SocialPlatform.TWITTER]: 'twitter',
  [SocialPlatform.LINKEDIN]: 'linkedin',
  [SocialPlatform.INSTAGRAM]: 'instagram',
  [SocialPlatform.FACEBOOK]: 'facebook',
  [SocialPlatform.YOUTUBE]: 'youtube',
  [SocialPlatform.DRIBBBLE]: 'globe',
  [SocialPlatform.BEHANCE]: 'globe',
  [SocialPlatform.MEDIUM]: 'globe',
  [SocialPlatform.DEVTO]: 'code',
  [SocialPlatform.WEBSITE]: 'globe',
  [SocialPlatform.OTHER]: 'link'
};

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
          <Icons 
            name={socialPlatformIcons[link.platform]} 
            className="h-5 w-5" 
          />
          <span className="sr-only">{link.name}</span>
        </Link>
      ))}
    </div>
  );
}

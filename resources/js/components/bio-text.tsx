import type { ReactNode } from 'react';
import { mentionPattern } from '@/lib/mentions';

// Like a shortened URL, the "@" stays in the text, so copying the bio keeps the mention.
function GitHubMention({ handle }: { handle: string }) {
    const href = `https://github.com/${handle}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            title={href}
            aria-label={`@${handle} on GitHub`}
            className="inline-flex h-[1.55em] max-w-full items-baseline gap-[0.2em] rounded-[0.3em] border bg-muted px-[calc(0.2em-1px)] align-baseline text-[0.93em] font-medium whitespace-nowrap text-inherit transition-colors hover:border-primary/45 hover:bg-primary-soft hover:text-primary-hover"
            data-test="bio-mention"
        >
            {/* A CSS symbol keeps the fallback out of copied bio text. */}
            <span
                aria-hidden="true"
                className="relative flex size-[1.15em] shrink-0 items-center justify-center self-center overflow-hidden rounded-[0.1em] bg-border before:text-[0.75em] before:leading-none before:text-muted-foreground before:content-['@']"
            >
                <img
                    key={href}
                    src={`${href}.png?size=40`}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                    className="absolute inset-0 size-full bg-border object-cover"
                    onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden';
                    }}
                />
            </span>
            <span className="min-w-0 truncate py-[calc(0.275em-1px)] leading-none">
                <span className="text-[0px]">@</span>
                {handle}
            </span>
        </a>
    );
}

/**
 * A bio or company synced from GitHub, with each tagged user or organization as a badge that opens it on GitHub.
 */
export function BioText({ bio }: { bio: string }) {
    const parts: ReactNode[] = [];
    let position = 0;

    for (const match of bio.matchAll(mentionPattern)) {
        parts.push(
            bio.slice(position, match.index),
            <GitHubMention key={match.index} handle={match[1]} />,
        );
        position = match.index + match[0].length;
    }

    parts.push(bio.slice(position));

    return <>{parts}</>;
}

import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/elements/button';

interface CrossReferenceLinkProps {
  userId: number;
  username?: string;
  email?: string;
}

export function CrossReferenceLink({ userId, username, email }: CrossReferenceLinkProps) {
  const displayText = username || email || `User #${userId}`;
  
  return (
    <Link 
      href={route('users.index', { highlight: userId })}
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      <Button variant="link" size="sm" className="h-auto p-0 text-inherit">
        {displayText}
        <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    </Link>
  );
}
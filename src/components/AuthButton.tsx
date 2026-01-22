import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/Button';
import { User, LogOut } from 'lucide-react';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Button variant="ghost" disabled>Lädt...</Button>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {session.user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>
      </div>
    );
  }

  return (
    <a href="/auth/signin">
      <Button variant="ghost" size="sm">
        <User className="h-4 w-4 mr-2" />
        Anmelden
      </Button>
    </a>
  );
}

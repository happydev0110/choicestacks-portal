import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { currentPlayer } from '../../lib/auth-server';
import { pageDefinitions } from '../../site-map';
import { AccountScreen } from '../../screens/account-screen';
import type { Player } from '../../lib/player';

export const dynamic = 'force-dynamic';

export default async function AccountPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  const key = ['account', ...section].join('/');
  const definition = pageDefinitions[key];
  if (!definition || definition.kind !== 'account') notFound();
  let player: Player | null;
  try { player = await currentPlayer(); }
  catch {
    return <div className="page-wrap"><section className="panel"><h1>Account temporarily unavailable</h1><p>We could not load your account. Please try again shortly.</p><Link className="primary" href={`/${key}`}>Try again</Link></section></div>;
  }
  if (!player) redirect(`/login?next=${encodeURIComponent(`/${key}`)}`);
  return <AccountScreen pageKey={key} title={definition.title} player={player} />;
}

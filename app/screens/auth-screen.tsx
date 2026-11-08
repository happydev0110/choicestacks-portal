'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { usePlayer } from '../components/player-auth';
import { playerRequest, type Player } from '../lib/player';

export function AuthScreen({ pageKey }: { pageKey: string }) {
  const register = pageKey === 'register';
  const reset = pageKey === 'forgot-password';
  const router = useRouter();
  const { signedIn, player } = usePlayer();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setError('');
    if (register && data.get('password') !== data.get('confirmPassword')) {
      setError('Passwords must match.'); return;
    }
    setPending(true);
    try {
      const common = { email: data.get('email'), password: data.get('password') };
      const result = await playerRequest<{ player: Player }>(register ? 'register' : 'login', register ? {
        ...common, displayName: data.get('displayName'), confirmPassword: data.get('confirmPassword'),
        acceptTerms: data.get('acceptTerms') === 'on',
      } : common);
      signedIn(result.player);
      form.reset();
      const requested = new URLSearchParams(window.location.search).get('next');
      const destination = requested && /^(?:\/account(?:\/[a-z-]+)?|\/play\/[a-fA-F0-9-]{36}|\/provider-games)$/.test(requested) ? requested : '/account';
      router.replace(destination);
      router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in. Please try again.'); }
    finally { setPending(false); }
  }

  return <div className="page-wrap auth-layout">
    <section className="auth-intro">
      <span className="eyebrow">WELCOME TO CHOICESTAKES</span>
      <h1>Your favorites.<br />One destination.</h1>
      <p>Create your player account and make yourself at home.</p>
      <div><ShieldCheck />Your account, protected with a private sign-in session.</div>
      <Link href="/casino" className="secondary">Explore the collection</Link>
    </section>
    <section className="panel auth-panel" aria-busy={pending}>
      <LockKeyhole className="auth-symbol" size={33} />
      <h2>{reset ? 'Password recovery' : register ? 'Create your account' : 'Welcome back'}</h2>
      {reset ? <>
        <p>Password recovery by email is not available yet. Contact support if you need help accessing your account.</p>
        <Link className="secondary" href="/contact">Contact support</Link>
      </> : player ? <>
        <p>You are signed in as {player.displayName}.</p>
        <Link className="primary" href="/account">Go to my account</Link>
      </> : <>
        <p>{register ? 'Join with your email and a secure password.' : 'Log in with your player account.'}</p>
        <noscript><p className="auth-error">Enable JavaScript to securely sign in or create an account.</p></noscript>
        <form className="page-form" method="post" onSubmit={submit}>
          {register && <label>Display name<input required name="displayName" minLength={2} maxLength={30} autoComplete="nickname" placeholder="Choose a display name" disabled={pending} /></label>}
          <label>Email address<input required name="email" type="email" maxLength={254} autoComplete="username" placeholder="you@example.com" disabled={pending} /></label>
          <label>Password<div className="password-field">
            <input required name="password" type={visible ? 'text' : 'password'} minLength={register ? 12 : 1} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} placeholder={register ? 'At least 12 characters' : 'Your password'} disabled={pending} />
            <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button>
          </div></label>
          {register && <label>Confirm password<input required name="confirmPassword" type={visible ? 'text' : 'password'} minLength={12} maxLength={128} autoComplete="new-password" placeholder="Enter your password again" disabled={pending} /></label>}
          {!register && <Link className="text-link form-right" href="/forgot-password">Forgot password?</Link>}
          {register && <label className="checkbox-label"><input required name="acceptTerms" type="checkbox" disabled={pending} /><span>I am 18 or over and agree to the <Link href="/terms/terms-of-service">Terms of Service</Link> and <Link href="/terms/privacy-policy">Privacy Policy</Link>.</span></label>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary" type="submit" disabled={pending || !ready}>{!ready ? 'Loading…' : pending ? register ? 'Creating account…' : 'Logging in…' : register ? 'Create account' : 'Log in'}</button>
        </form>
      </>}
      <div className="auth-switch">{reset ? <Link href="/login">Back to log in</Link> : register ? <>Already have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/register">Join now</Link></>}</div>
    </section>
  </div>;
}

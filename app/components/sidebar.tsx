'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { asset } from '../data';
import { BrandLogo } from './brand-logo';
import './sidebar.css';

const railItems = [
  ['Casino', 'casino.dea5f87e.png'], ['Sports', 'football.2efdf0b1.png'],
  ['Promotions', 'promotions.2684d026.png'], ['Slots', 'slots.b6762e18.png'],
  ['Live Casino', 'live-casino.b9d52e4b.png'], ['Crash & Instant', 'dice.bdc6efaf.png'],
  ['Table & Cards', 'blackjack.5ed1c9b4.png'], ['Lotto & Scratch', 'scratch-cards.d8bb04ad.png'],
  ['Affiliate', 'wallet.e66fcad1.png'], ['English', 'language.58fb5410.png'],
];
const drawerItems = [
  ['Crash & Instant', 'dice.bdc6efaf.png'], ['Table & Cards', 'blackjack.5ed1c9b4.png'],
  ['Lotto & Scratch', 'scratch-cards.d8bb04ad.png'], ['Promotions', 'promotions.2684d026.png'],
  ['Loyalty Tiers', 'vip.cee8642b.png'],
];

type Props = { active: string; mobileOpen: boolean; onClose: () => void; onChoose: (target: string) => void };

function MenuContents({ active, onChoose, mobile = false }: Pick<Props, 'active' | 'onChoose'> & { mobile?: boolean }) {
  const language = <button className="drawer-item language-item" onClick={() => onChoose('Language')}><img src={asset('language.58fb5410.png')} alt=""/><span>English</span><ChevronRight size={20}/></button>;
  return <div className="navigation-content">
    <div className="navigation-tabs">{railItems.slice(0, 2).map(([name, image]) => <button key={name} className={active === name || (active === 'Home' && name === 'Casino') ? 'selected' : ''} onClick={() => onChoose(name)}><img src={asset(image)} alt=""/>{name}</button>)}</div>
    {mobile && language}
    <div className="cashback-card"><strong>DAILY<br/>CASHBACK</strong><span>Coming soon</span><button className="primary" onClick={() => onChoose('Promotions')}>See Details →</button></div>
    <div className="navigation-featured">{[['Live Casino', 'live-casino-element.d7c46a6f.webp'], ['Slots', 'slots-machine.d48b1a72.webp']].map(([name, image]) => <button className="drawer-feature" key={name} onClick={() => onChoose(name)}><span>{name}</span><img src={asset(image)} alt=""/></button>)}</div>
    <div className="navigation-links">{drawerItems.map(([name, image]) => <button className={`drawer-item ${active === name ? 'current' : ''}`} key={name} onClick={() => onChoose(name)}><img src={asset(image)} alt=""/><span>{name}</span></button>)}</div>
    <button className="drawer-item buy-crypto" onClick={() => onChoose('Crypto Payments')}>Buy Crypto</button>
    <button className="drawer-item" onClick={() => onChoose('Affiliate')}><img src={asset('wallet.e66fcad1.png')} alt=""/><span>Affiliate</span></button>
    {!mobile && language}
  </div>;
}

export function Sidebar({ active, mobileOpen, onClose, onChoose }: Props) {
  const [expanded, setExpanded] = useState(false);
  const host = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setExpanded(true);
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (!host.current?.contains(document.activeElement)) setExpanded(false);
    }, 150);
  };

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (!mobileOpen) { drawer.current?.close(); return; }
    drawer.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) closeCallback.current(); };
    desktop.addEventListener('change', onResize);
    onResize();
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener('change', onResize);
      drawer.current?.close();
    };
  }, [mobileOpen]);

  return <>
    <aside ref={host} className="navigation-rail" aria-label="Main navigation" onPointerEnter={open} onPointerLeave={close}
      onFocusCapture={open} onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          if (closeTimer.current) clearTimeout(closeTimer.current);
          setExpanded(false);
        }
      }} onKeyDown={(event) => {
        if (event.key === 'Escape') { setExpanded(false); (document.activeElement as HTMLElement)?.blur(); }
      }}>
      <div className="rail-icons">
        {railItems.map(([name, image]) => <button tabIndex={expanded ? -1 : 0} key={name} title={name} aria-label={name} aria-current={active === name ? 'page' : undefined} className={active === name ? 'active' : ''} onClick={() => onChoose(name === 'English' ? 'Language' : name)}><img src={asset(image)} alt=""/></button>)}
      </div>
      <div className={`navigation-flyout ${expanded ? 'is-open' : ''}`} inert={!expanded}>
        <MenuContents active={active} onChoose={onChoose}/>
      </div>
    </aside>
    <dialog ref={drawer} id="mobile-menu" className="mobile-menu-dialog" aria-label="Choicestakes Menu" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="mobile-menu-surface">
        <div className="mobile-menu-heading"><BrandLogo variant="drawer"/><button aria-label="Close menu" onClick={onClose}><X/></button></div>
        <MenuContents active={active} onChoose={onChoose} mobile/>
      </div>
    </dialog>
  </>;
}

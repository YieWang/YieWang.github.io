import { useEffect, useRef, type ReactNode } from 'react';

export interface PhotoWheelOption {
  value: string;
  label: ReactNode;
  textValue: string;
}

const itemHeight = 82;
const itemAngle = 22.5;
const radius = itemHeight / Math.tan(itemAngle * Math.PI / 180);
const height = Math.round(radius * 2 + itemHeight / 4);

export default function PhotoWheel({ options, value, onValueChange }: {
  options: PhotoWheelOption[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const wheel = useRef<HTMLUListElement>(null);
  const highlight = useRef<HTMLUListElement>(null);
  const selected = useRef(value);
  const keyboardTarget = useRef<number | null>(null);
  const initialIndex = useRef(Math.max(0, options.findIndex(option => option.value === value))).current;
  const notify = useRef(onValueChange);
  notify.current = onValueChange;
  const drag = useRef<{ y: number; top: number; lastY: number; time: number; speed: number; moved: boolean } | null>(null);
  const ignoreClick = useRef(false);

  useEffect(() => {
    const element = scroller.current!;
    const gallery = element.closest('#gallery-viewport-root') as HTMLElement;
    const stage = gallery.querySelector('#right-showcase-stage') as HTMLElement;
    const previousTouchAction = stage.style.touchAction;
    stage.style.touchAction = 'none';
    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout>;
    let wheelTimer: ReturnType<typeof setTimeout>;
    let wheeling = false;
    const draw = () => {
      const position = element.scrollTop / itemHeight;
      wheel.current!.style.transform = `translateZ(${-radius}px) rotateX(${position * itemAngle}deg)`;
      highlight.current!.style.transform = `translateY(${-element.scrollTop}px)`;
      Array.from(wheel.current!.children).forEach((child, index) => {
        (child as HTMLElement).style.visibility = Math.abs(index - position) < 4 ? 'visible' : 'hidden';
      });
    };
    const settle = () => {
      if (drag.current || wheeling) return;
      const index = Math.max(0, Math.min(options.length - 1, Math.round(element.scrollTop / itemHeight)));
      if (Math.abs(element.scrollTop - index * itemHeight) > 0.5) return;
      if (keyboardTarget.current !== null && index !== keyboardTarget.current) return;
      keyboardTarget.current = null;
      element.style.scrollSnapType = '';
      const next = options[index]?.value;
      if (next && next !== selected.current) {
        selected.current = next;
        notify.current(next);
      }
    };
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    };
    const stopAt = (top: number) => {
      clearTimeout(settleTimer);
      element.scrollTo({ top: Math.max(0, Math.min(options.length - 1, Math.round(top / itemHeight))) * itemHeight, behavior: 'smooth' });
      settleTimer = setTimeout(settle, 160);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 };
      const endpoint = event.key === 'Home' || event.key === 'End';
      if (!(event.key in steps) && !(endpoint && element.contains(event.target as Node))) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : (keyboardTarget.current ?? Math.round(element.scrollTop / itemHeight)) + steps[event.key];
      keyboardTarget.current = Math.max(0, Math.min(options.length - 1, index));
      element.style.scrollSnapType = 'none';
      // Key repeat must not keep restarting the smooth scroll before it can advance.
      element.scrollTo({ top: keyboardTarget.current * itemHeight, behavior: event.repeat ? 'instant' : 'smooth' });
      if (event.repeat) settle();
    };
    // Both sides feed the same scroll position; trackpad momentum is already in deltaY.
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return;
      event.preventDefault();
      wheeling = true;
      keyboardTarget.current = null;
      element.style.scrollSnapType = 'none';
      clearTimeout(wheelTimer);
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1;
      element.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
      wheelTimer = setTimeout(() => { wheeling = false; stopAt(element.scrollTop); }, 140);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || (event.target as Element).closest('a, button')) return;
      const surface = (event.target as Element).closest('.photo-wheel-scroll, #right-showcase-stage') as HTMLElement | null;
      if (!surface) return;
      keyboardTarget.current = null;
      event.preventDefault();
      if (surface === element) element.focus({ preventScroll: true });
      ignoreClick.current = false;
      clearTimeout(wheelTimer);
      wheeling = false;
      drag.current = { y: event.clientY, top: element.scrollTop, lastY: event.clientY, time: performance.now(), speed: 0, moved: false };
      element.style.scrollSnapType = 'none';
      surface.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const state = drag.current;
      if (!state) return;
      const now = performance.now();
      state.speed = (state.lastY - event.clientY) / Math.max(1, now - state.time);
      state.time = now;
      state.lastY = event.clientY;
      state.moved ||= Math.abs(state.y - event.clientY) > 5;
      element.scrollTop = state.top + state.y - event.clientY;
    };
    const onPointerUp = () => {
      const state = drag.current;
      if (!state) return;
      drag.current = null;
      ignoreClick.current = state.moved;
      const offset = state.moved && performance.now() - state.time < 80 ? Math.max(-3, Math.min(3, state.speed)) * 180 : 0;
      stopAt(element.scrollTop + offset);
    };
    const onPointerCancel = () => { drag.current = null; stopAt(element.scrollTop); };
    element.scrollTop = Math.max(0, options.findIndex(option => option.value === selected.current)) * itemHeight;
    draw();
    element.addEventListener('scroll', scroll, { passive: true });
    element.addEventListener('scrollend', settle);
    window.addEventListener('keydown', onKeyDown);
    gallery.addEventListener('wheel', onWheel, { passive: false });
    gallery.addEventListener('pointerdown', onPointerDown);
    gallery.addEventListener('pointermove', onPointerMove);
    gallery.addEventListener('pointerup', onPointerUp);
    gallery.addEventListener('pointercancel', onPointerCancel);
    return () => {
      element.removeEventListener('scroll', scroll);
      element.removeEventListener('scrollend', settle);
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      clearTimeout(wheelTimer);
      gallery.removeEventListener('wheel', onWheel);
      gallery.removeEventListener('pointerdown', onPointerDown);
      gallery.removeEventListener('pointermove', onPointerMove);
      gallery.removeEventListener('pointerup', onPointerUp);
      gallery.removeEventListener('pointercancel', onPointerCancel);
      stage.style.touchAction = previousTouchAction;
    };
  }, [options]);

  useEffect(() => {
    if (value === selected.current) return;
    keyboardTarget.current = null;
    selected.current = value;
    scroller.current?.scrollTo({ top: Math.max(0, options.findIndex(option => option.value === value)) * itemHeight, behavior: 'smooth' });
  }, [value, options]);

  return (
    <div data-rwp style={{ height }}>
      <ul ref={wheel} data-rwp-options aria-hidden="true" style={{ pointerEvents: 'none', transform: `translateZ(${-radius}px) rotateX(${initialIndex * itemAngle}deg)` }}>
        {options.map((option, index) => (
          <li key={option.value} data-rwp-option data-index={index} className="photo-wheel-option"
            style={{ top: -itemHeight / 2, height: itemHeight, lineHeight: `${itemHeight}px`, visibility: Math.abs(index - initialIndex) < 4 ? 'visible' : 'hidden', transform: `rotateX(${-index * itemAngle}deg) translateZ(${radius}px)` }}>
            {option.label}
          </li>
        ))}
      </ul>
      <div data-rwp-highlight-wrapper className="photo-wheel-highlight-wrapper" aria-hidden="true" style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}>
        <ul ref={highlight} data-rwp-highlight-list style={{ transform: `translateY(${-initialIndex * itemHeight}px)` }}>
          {options.map(option => <li key={option.value} data-rwp-highlight-item className="photo-wheel-highlight-item" style={{ height: itemHeight }}>{option.label}</li>)}
        </ul>
      </div>
      <div ref={scroller} className="photo-wheel-scroll" tabIndex={0} role="listbox" aria-label="Photographs"
        aria-activedescendant={`photo-option-${value}`}
        onClick={event => {
          if (ignoreClick.current) return;
          keyboardTarget.current = null;
          const offset = event.clientY - event.currentTarget.getBoundingClientRect().top - height / 2;
          event.currentTarget.scrollTo({ top: Math.round((event.currentTarget.scrollTop + offset) / itemHeight) * itemHeight, behavior: 'smooth' });
        }}
      >
        {options.map(option => <div key={option.value} id={`photo-option-${option.value}`} role="option"
          aria-label={option.textValue} aria-selected={option.value === value} style={{ height: itemHeight, scrollSnapAlign: 'center' }} />)}
      </div>
      <style>{`
        .photo-wheel-scroll {
          position: absolute; inset: 0; overflow-y: auto; overscroll-behavior: contain;
          scroll-snap-type: y mandatory; scrollbar-width: none;
          padding-block: ${(height - itemHeight) / 2}px;
          cursor: default; touch-action: none;
        }
        .photo-wheel-scroll::-webkit-scrollbar { display: none; }
        .photo-wheel-scroll:focus-visible { outline: 1px solid #aaa; outline-offset: -1px; }
      `}</style>
    </div>
  );
}

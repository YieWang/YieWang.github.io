import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

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
  const cancelKeyboard = useRef(() => {});
  const initialIndex = useRef(Math.max(0, options.findIndex(option => option.value === value))).current;
  const notify = useRef(onValueChange);
  notify.current = onValueChange;
  const drag = useRef<{ y: number; top: number; lastY: number; time: number; speed: number; moved: boolean } | null>(null);
  const ignoreClick = useRef(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (mobile) return;
    const element = scroller.current!;
    const gallery = element.closest('#gallery-viewport-root') as HTMLElement;
    const stage = gallery.querySelector('#right-showcase-stage') as HTMLElement;
    const previousTouchAction = stage.style.touchAction;
    stage.style.touchAction = 'none';
    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout>;
    let wheelTimer: ReturnType<typeof setTimeout>;
    let wheeling = false;
    let heldKey = '';
    let keyFrame = 0;
    let keyTime = 0;
    let keyPosition = 0;
    let keyVelocity = 0;
    let keyRepeatAt = 0;
    let keyHolding = false;
    let keyTapTarget = 0;
    const stopKeyboard = () => {
      heldKey = '';
      keyHolding = false;
      cancelAnimationFrame(keyFrame);
      keyFrame = 0;
      keyVelocity = 0;
      keyboardTarget.current = null;
    };
    cancelKeyboard.current = stopKeyboard;
    const commit = (index: number) => {
      const next = options[index]?.value;
      if (typeof selected !== 'undefined' && typeof notify !== 'undefined') {
        if (next && next !== selected.current) {
          selected.current = next;
          notify.current(next);
        }
      }
    };
    const draw = () => {
      const position = element.scrollTop / itemHeight;
      wheel.current!.style.transform = `translateZ(${-radius}px) rotateX(${position * itemAngle}deg)`;
      wheel.current!.style.setProperty('--photo-wheel-angle', `${position * itemAngle}deg`);
      highlight.current!.style.transform = `translateY(${-element.scrollTop}px)`;
      Array.from(wheel.current!.children).forEach((child, index) => {
        (child as HTMLElement).style.visibility = Math.abs(index - position) < 4 ? 'visible' : 'hidden';
        (child as HTMLElement).style.setProperty('--photo-caption-distance', String(Math.min(1, Math.abs(index - position))));
      });
    };
    const settle = () => {
      if (drag.current || wheeling || keyFrame) return;
      const index = Math.max(0, Math.min(options.length - 1, Math.round(element.scrollTop / itemHeight)));
      if (Math.abs(element.scrollTop - index * itemHeight) > 0.5) return;
      if (keyboardTarget.current !== null && index !== keyboardTarget.current) return;
      keyboardTarget.current = null;
      element.style.scrollSnapType = '';
      commit(index);
    };
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    };
    const stopAt = (top: number) => {
      clearTimeout(settleTimer);
      const index = Math.max(0, Math.min(options.length - 1, Math.round(top / itemHeight)));
      commit(index);
      element.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
      settleTimer = setTimeout(settle, 160);
    };
    const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 };
    const advanceKeyboard = (now: number) => {
      if (keyboardTarget.current === null) return;
      // Own the hold cadence: OS auto-repeat starts too late to join the first step.
      if (heldKey && now >= keyRepeatAt) {
        const direction = steps[heldKey];
        const position = keyPosition / itemHeight;
        const next = keyHolding ? keyboardTarget.current + direction : keyTapTarget;
        const bounded = direction > 0 ? Math.min(next, Math.floor(position) + 3) : Math.max(next, Math.ceil(position) - 3);
        keyboardTarget.current = Math.max(0, Math.min(options.length - 1, bounded));
        keyHolding = true;
        keyRepeatAt = now + 60;
      }
      const target = keyboardTarget.current * itemHeight;
      // A critically damped spring preserves velocity when the target changes.
      const dt = Math.min(now - keyTime, 32) / 1000;
      const offset = keyPosition - target;
      const impulse = (keyVelocity + 24 * offset) * dt;
      const decay = Math.exp(-24 * dt);
      keyPosition = Math.max(0, Math.min((options.length - 1) * itemHeight, target + (offset + impulse) * decay));
      keyVelocity = (keyVelocity - 24 * impulse) * decay;
      keyTime = now;
      element.scrollTop = keyPosition;
      if (!heldKey && Math.abs(keyPosition - target) < 0.5 && Math.abs(keyVelocity) < 4) {
        element.scrollTop = target;
        keyFrame = 0;
        keyVelocity = 0;
        settle();
        return;
      }
      keyFrame = requestAnimationFrame(advanceKeyboard);
    };
    const releaseKeyboard = () => {
      if (!keyFrame) return;
      stopKeyboard();
      stopAt(element.scrollTop);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== heldKey) return;
      const wasHolding = keyHolding;
      heldKey = '';
      if (!wasHolding) {
        keyboardTarget.current = keyTapTarget;
        commit(keyTapTarget);
      } else if (keyboardTarget.current !== null) {
        commit(keyboardTarget.current);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const endpoint = event.key === 'Home' || event.key === 'End';
      if (!(event.key in steps) && !(endpoint && element.contains(event.target as Node))) return;
      event.preventDefault();
      if (drag.current) return;
      if (event.repeat) return;
      clearTimeout(wheelTimer);
      wheeling = false;
      if (endpoint) {
        stopKeyboard();
        keyboardTarget.current = event.key === 'Home' ? 0 : options.length - 1;
        element.style.scrollSnapType = 'none';
        stopAt(keyboardTarget.current * itemHeight);
        return;
      }
      const direction = steps[event.key];
      const position = element.scrollTop / itemHeight;
      const reversing = keyHolding && keyboardTarget.current !== null && (keyboardTarget.current - position) * direction < 0;
      const index = (reversing ? Math.round(position) : keyboardTarget.current ?? Math.round(position)) + direction;
      keyTapTarget = Math.max(0, Math.min(options.length - 1, index));
      element.style.scrollSnapType = 'none';
      const continuingHold = !!heldKey && keyHolding;
      if (continuingHold) keyboardTarget.current = keyTapTarget;
      heldKey = event.key;
      keyHolding = continuingHold;
      keyRepeatAt = performance.now() + (continuingHold ? 60 : 140);
      if (!keyFrame) {
        keyPosition = element.scrollTop;
        keyboardTarget.current = keyPosition / itemHeight;
        element.scrollTo({ top: keyPosition, behavior: 'instant' });
        keyTime = performance.now();
        keyFrame = requestAnimationFrame(advanceKeyboard);
      }
    };
    // Both sides feed the same scroll position; trackpad momentum is already in deltaY.
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return;
      event.preventDefault();
      stopKeyboard();
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
      stopKeyboard();
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
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseKeyboard);
    gallery.addEventListener('wheel', onWheel, { passive: false });
    gallery.addEventListener('pointerdown', onPointerDown);
    gallery.addEventListener('pointermove', onPointerMove);
    gallery.addEventListener('pointerup', onPointerUp);
    gallery.addEventListener('pointercancel', onPointerCancel);
    return () => {
      element.removeEventListener('scroll', scroll);
      element.removeEventListener('scrollend', settle);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseKeyboard);
      stopKeyboard();
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
  }, [options, mobile]);

  useEffect(() => {
    if (value === selected.current) return;
    cancelKeyboard.current();
    keyboardTarget.current = null;
    selected.current = value;
    scroller.current?.scrollTo({ top: Math.max(0, options.findIndex(option => option.value === value)) * itemHeight, behavior: 'smooth' });
  }, [value, options]);

  return (
    <div data-rwp style={{ height }}>
      <ul ref={wheel} data-rwp-options aria-hidden="true" style={{ pointerEvents: 'none', '--photo-wheel-angle': `${initialIndex * itemAngle}deg`, transform: `translateZ(${-radius}px) rotateX(${initialIndex * itemAngle}deg)` } as CSSProperties}>
        {options.map((option, index) => (
          <li key={option.value} data-rwp-option data-index={index} className="photo-wheel-option"
            style={{ top: -itemHeight / 2, height: itemHeight, lineHeight: `${itemHeight}px`, '--photo-item-angle': `${index * itemAngle}deg`, '--photo-caption-distance': Math.min(1, Math.abs(index - initialIndex)), visibility: Math.abs(index - initialIndex) < 4 ? 'visible' : 'hidden', transform: `rotateX(${-index * itemAngle}deg) translateZ(${radius}px)` } as CSSProperties}>
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
          cancelKeyboard.current();
          keyboardTarget.current = null;
          const offset = event.clientY - event.currentTarget.getBoundingClientRect().top - height / 2;
          const targetIndex = Math.max(0, Math.min(options.length - 1, Math.round((event.currentTarget.scrollTop + offset) / itemHeight)));
          const next = options[targetIndex]?.value;
          if (next && next !== selected.current) {
            selected.current = next;
            notify.current(next);
          }
          event.currentTarget.scrollTo({ top: targetIndex * itemHeight, behavior: 'smooth' });
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
        .photo-wheel-scroll:focus-visible { outline: none; }
      `}</style>
    </div>
  );
}

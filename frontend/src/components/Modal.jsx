import { useEffect, useRef } from 'react';
export default function Modal({ title, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement; const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = dialog.querySelector('button, input, select, a[href]'); (first || dialog).focus();
    function trap(event) {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled), input, select, a[href]')];
      if (!controls.length) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    }
    dialog.addEventListener('keydown', trap);
    return () => { dialog.removeEventListener('keydown', trap); document.body.style.overflow = previousOverflow; previous?.focus?.({ preventScroll: true }); };
  }, []);
  return <div className="modal-backdrop"><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`modal-card ${wide ? 'modal-wide' : ''}`}><div className="eyebrow">HISRUN · HÀNH TRÌNH TRI THỨC</div><h2>{title}</h2>{children}</section></div>;
}

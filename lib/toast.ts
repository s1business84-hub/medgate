export function showToast(message: string, timeout = 3000) {
  if (typeof window === 'undefined') return;
  const id = `medgate_toast_${Date.now()}`;
  const el = document.createElement('div');
  el.id = id;
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    background: 'rgba(15,23,42,0.95)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
    zIndex: '9999',
    fontSize: '14px',
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 300ms';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 350);
  }, timeout);
}

export default showToast;

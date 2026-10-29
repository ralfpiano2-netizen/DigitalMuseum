// Visitor state: the shared prepaid load of the 2000s wing, and the artifact passport.

const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

export const wallet = {
  balance: 5,
  infinite: false,
  spend(n) {
    if (this.infinite) return true;
    if (this.balance < n) return false;
    this.balance -= n;
    emit('wallet', { balance: this.balance, infinite: this.infinite });
    return true;
  },
  add(n) {
    this.balance += n;
    emit('wallet', { balance: this.balance, infinite: this.infinite });
  },
  setInfinite(on) {
    if (this.infinite === on) return;
    this.infinite = on;
    emit('wallet', { balance: this.balance, infinite: this.infinite });
  },
};

const KEY = 'always-on:passport';
let stamped = null;

function load() {
  if (stamped) return stamped;
  try {
    stamped = new Set(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch {
    stamped = new Set();
  }
  return stamped;
}

export const passport = {
  has: id => load().has(id),
  count: () => load().size,
  stamp(id) {
    if (load().has(id)) return false;
    stamped.add(id);
    try { localStorage.setItem(KEY, JSON.stringify([...stamped])); } catch { /* private mode: stamps last for this visit only */ }
    emit('stamp', { id, count: stamped.size });
    return true;
  },
};

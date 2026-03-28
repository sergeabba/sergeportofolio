/**
 * Scroll fluide vers un élément par son ID,
 * avec compensation de la navbar fixe.
 */
export function smoothScrollTo(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Formate un index numérique en string "01", "02"...
 */
export function padIndex(n: number, total: number): string {
  const digits = String(total).length;
  return String(n).padStart(Math.max(digits, 2), "0");
}

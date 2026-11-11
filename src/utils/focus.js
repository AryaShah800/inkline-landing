// Moves keyboard focus to a field after a button scrolls the page to the form.
// Skipped on touch screens, where focusing an input would pop up the on-screen keyboard.
export function focusField(id) {
  if (!window.matchMedia('(pointer: fine)').matches) return
  window.setTimeout(() => {
    document.getElementById(id)?.focus({ preventScroll: true })
  }, 60)
}

export function ConfirmationMessage(decision: string, id: string) {
  if (!decision) return `<p>Please provide a decision.</p>`

  return `
    <form method="post" action="/form-complete?decision=${encodeURIComponent(
      decision
    )}&id=${encodeURIComponent(id)}" onsubmit="document.querySelectorAll('button').forEach(el=>{el.disabled=true;el.style.opacity='0.5'})">
      <p>Are you sure you want to ${decision}?</p>
      <button type="submit">Yes</button>
      <button type="reset" onclick="window.close()">No</button>
    </form>
  `
}

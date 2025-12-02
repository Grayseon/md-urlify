export function ConfirmationMessage({ decision, id }: { decision: string, id: string}) {
  if (!decision) return <p>Please provide a decision.</p>

  return (
    <form method="post" action={`/form-complete?decision=${decision}&id=${id}`} onSubmit={()=>{
      document.querySelectorAll('button').forEach(el=>{
        el.disabled = true
        el.style.opacity = "0.5"
      })
    }}>
      <p>Are you sure you want to {decision}?</p>
      <button type="submit">Yes</button>
      <button type="reset" onClick={() => window.close()}>No</button>
    </form>
  )
}
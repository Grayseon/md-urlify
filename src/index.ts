import { Hono } from "hono"
import { ConfirmationMessage } from "./components.js"

const app = new Hono()

function convertUrls(text: string, prefix?: string) {
  const regex =
    /(?<![\[\(])\b(?:https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/\S*)?/g
  const matches = [...text.matchAll(regex)]
  let result = text
  let offset = 0
  let count = 1

  for (const match of matches) {
    const m = match[0]
    const start = match.index + offset
    const end = start + m.length
    const full = m.startsWith("http") ? m : "https://" + m
    const title = prefix ? prefix + " " + count++ : full
    const replacement = `[${title}](${full})`
    result = result.slice(0, start) + replacement + result.slice(end)
    offset += replacement.length - m.length
  }

  return result
}

app.get("/", async (c) => {
  const encodedText = c.req.query("text")
  const prefix = c.req.query("prefix")
  if (!encodedText)
    return c.text(
      "Welcome to md-urlify. Enter a base-64 encoded text into a text URL param to turn URLs into MD URLs."
    )
  const text = atob(encodedText)

  return c.text(convertUrls(text, prefix))
})

app.get('/form-complete', async (c) => {
  const decision = c.req.query("decision")!
  const id = c.req.query("id")!

  return c.html(ConfirmationMessage({
    decision, id
  }))
})

app.post('/form-complete', async (c) => {
  const decision = c.req.query("decision")
  const id = c.req.query("id")

  const url = process.env.FLOW_URL

  const req = await fetch(`${url}&decision=${decision}&id=${id}`)
  const text = await req.text()

  return c.text(text.toString())
})

export default app

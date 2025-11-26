import { Hono } from "hono"

const app = new Hono()

function convertUrls(text: string, prefix?: string) {
  const regex = /\b(?:https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/\S*)?/g
  const matches = text.match(regex) || []
  let count = 1
  let result = text

  for (const m of matches) {
    const full = m.startsWith("http") ? m : "https://" + m
    const escaped = m.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    const title = prefix ? prefix + " " + count++ : full
    result = result.replace(new RegExp(escaped, "g"), `(${title})[${full}]`)
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

export default app

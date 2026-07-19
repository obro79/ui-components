import { mkdir } from "node:fs/promises"
import { chromium } from "@playwright/test"

const baseURL = process.env.UI_MADE_EASY_URL ?? "http://127.0.0.1:4174"
const outputDirectory = new URL("../.github/assets/readme/", import.meta.url)

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })

async function resetWorkbench() {
  await page.goto(baseURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.locator(".app.theme-scope").waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" })
}

await resetWorkbench()
await page.screenshot({ path: new URL("workbench-v03.png", outputDirectory).pathname })

await page.getByRole("tab", { name: "Motion", exact: true }).click()
await page.locator(".motion-playground").waitFor()
await page.locator(".customizer-inline").screenshot({ path: new URL("motion-v03.png", outputDirectory).pathname })

await page.getByRole("tab", { name: "Styles", exact: true }).click()
await page.locator(".style-selector__grid").waitFor()
await page.locator(".style-selector__grid").screenshot({ path: new URL("style-grid-v03.png", outputDirectory).pathname })

await page.locator("#builder-essentials").evaluate((element) => element.scrollIntoView({ block: "start" }))
await page.locator("#builder-essentials h2").waitFor()
await page.screenshot({ path: new URL("builder-essentials-v03.png", outputDirectory).pathname })

await browser.close()

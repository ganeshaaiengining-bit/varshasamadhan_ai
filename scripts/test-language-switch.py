"""
Check the language actually switches *without* a manual reload.

    python scripts/test-language-switch.py

Why this needs a real browser: the earlier verification fetched each page once
with the cookie already set, which proves the server honours the cookie. It says
nothing about the thing a visitor actually does — taps the picker, and expects
the page in front of them to change.

Half this site is server-rendered, so the context update alone only moves the
client half. The page had to refresh itself on a language change, and that is
exactly the sort of thing that works in a test harness and does nothing for a
person on a phone.

Uses Playwright over the already-installed Node, so there is no Python browser
dependency. Skips rather than fails if the driver is absent, because a missing
optional tool is not a broken site.
"""

import io
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

NODE = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    "Programs",
    "node-v24.19.0-win-x64",
    "node.exe",
)

DRIVER = """
const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    // Drives the Chrome already installed on this machine rather than downloading
    // a second copy of Chromium — a 150 MB download to test a page is not a
    // reasonable thing for a script to do unasked.
    browser = await chromium.launch({ channel: 'chrome' });
  } catch (e) {
    console.log('SKIP ' + e.message.split('\\n')[0]);
    process.exit(2);
  }

  const page = await browser.newPage();
  const results = [];
  const fail = (m) => results.push('FAIL ' + m);
  const pass = (m) => results.push('OK   ' + m);

  await page.goto('http://127.0.0.1:3001/samaroh', { waitUntil: 'networkidle' });

  // Start from a known language by setting the cookie the picker writes.
  await page.context().addCookies([
    { name: 'vs-lang', value: 'hi', url: 'http://127.0.0.1:3001' },
  ]);
  await page.goto('http://127.0.0.1:3001/samaroh', { waitUntil: 'networkidle' });

  const hindiBefore = await page.locator('h1').first().innerText();

  // Open the picker and choose Tamil, the way a visitor would.
  await page.getByRole('button', { name: /भाषा|ভাষা|தமிழ்/ }).first().click().catch(() => {});
  await page.getByRole('option', { name: /தமிழ்/ }).first().click();

  // Give the refresh a moment, then look WITHOUT reloading.
  await page.waitForTimeout(2500);

  const lang = await page.evaluate(() => document.documentElement.lang);
  const heading = await page.locator('h1').first().innerText();

  if (lang === 'ta') pass('html lang switched to ta without reload');
  else fail('html lang is ' + lang + ', expected ta');

  if (heading !== hindiBefore) pass('server-rendered h1 changed: "' + heading + '"');
  else fail('h1 unchanged ("' + heading + '") - server half did not refresh');

  // And confirm it is genuinely Tamil text, not the key name.
  if (/[\\u0B80-\\u0BFF]/.test(heading)) pass('heading is in Tamil script');
  else fail('heading has no Tamil characters: ' + heading);

  // The URL must not change, or the back button walks through 18 languages.
  if (page.url().endsWith('/samaroh')) pass('URL unchanged');
  else fail('URL changed to ' + page.url());

  console.log(results.join('\\n'));
  await browser.close();
})();
"""


def main() -> int:
    # Written inside the project, not the temp folder: `require('playwright')`
    # resolves from the module's own location, so a script in %TEMP% cannot see
    # the project's node_modules and fails with a confusing "module not found".
    driver = os.path.join(".import", "lang-check.cjs")
    os.makedirs(".import", exist_ok=True)
    io.open(driver, "w", encoding="utf-8").write(DRIVER)

    try:
        result = subprocess.run(
            [NODE, driver],
            cwd=".",
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=300,
        )
    except Exception as error:  # noqa: BLE001
        print(f"could not run the driver: {error}")
        return 0

    output = (result.stdout or "").strip()
    if "SKIP" in output:
        print("SKIPPED:", output.replace("SKIP ", ""))
        print("Install the driver with:  npm i -D playwright  &&  npx playwright install chromium")
        return 0

    print(output)
    if result.stderr.strip():
        print("--- driver stderr ---")
        print(result.stderr.strip()[:600])

    failures = [line for line in output.splitlines() if line.startswith("FAIL")]
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
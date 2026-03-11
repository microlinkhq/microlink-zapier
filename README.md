# microlink-zapier-integration

> Microlink.io integration for Zapier CLI (`zapier-platform-core` v15): fetch metadata, screenshots, PDFs, Markdown, plain text, audio/video sources, performance insights, and logo palette data from any URL.

<a href="https://microlink.io"><img src="https://img.shields.io/badge/powered_by-microlink.io-blue?style=flat-square&color=%23EA407B" alt="Powered by microlink.io"></a>
<a href="https://zapier.com/developer"><img src="https://img.shields.io/badge/platform-Zapier%20CLI-FF4A00?style=flat-square" alt="Zapier CLI"></a>

---

- [What This App Includes](#what-this-app-includes)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
- [Authentication](#authentication)
- [Actions (Tools)](#actions-tools)
  - [Extract](#extract)
  - [Screenshot](#screenshot)
  - [PDF](#pdf)
  - [Markdown](#markdown)
  - [Text](#text)
  - [Audio](#audio)
  - [Video](#video)
  - [Insights](#insights)
  - [Logo](#logo)
- [Parameters Reference](#parameters-reference)
  - [Top-level Inputs](#top-level-inputs)
  - [Response Mode](#response-mode)
  - [Browser and Rendering Options](#browser-and-rendering-options)
  - [Data and Response Options](#data-and-response-options)
  - [Caching and Network Options](#caching-and-network-options)
  - [Viewport Options](#viewport-options)
  - [PDF Options](#pdf-options)
  - [Screenshot Options](#screenshot-options)
  - [JSON Options](#json-options)
  - [Additional Query Parameters](#additional-query-parameters)
- [Query-Building Rules](#query-building-rules)
- [Error Handling](#error-handling)
- [How to Use in Zapier CLI](#how-to-use-in-zapier-cli)
- [Testing](#testing)
  - [Run All Tests](#run-all-tests)
  - [Run Tests for One Action](#run-tests-for-one-action)
  - [Test Structure](#test-structure)
- [Project Structure](#project-structure)

---

## What This App Includes

- Custom auth with optional API key (`x-api-key`) and optional base URL override.
- 9 create actions (no triggers, no searches):
  - `extract`, `screenshot`, `pdf`, `markdown`, `text`, `audio`, `video`, `insights`, `logo`.
- Full Microlink query-param mapping, including nested dot-notation flattening.
- Advanced options, JSON object inputs, and additional arbitrary query params.
- Error normalization for HTTP failures and Microlink `{ status: "error" }` responses.
- Action-level tests using `zapier-platform-core` test tools + `nock`.

---

## Installation

### Prerequisites

- Node.js `>=18`
- npm
- Zapier CLI account access (for `zapier push`)

### Project Setup

```bash
npm install
```

Run tests:

```bash
npm test
```

---

## Authentication

Configured in `authentication.js` using Zapier `type: "custom"`.

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | password | No | Microlink Pro/Enterprise API key. If present, sent as `x-api-key` header. |
| `baseUrl` | string | No | Optional endpoint override. |

Base URL resolution:

- If `baseUrl` is provided -> use it.
- Else if `apiKey` exists -> `https://pro.microlink.io`.
- Else -> `https://api.microlink.io`.

Auth test behavior:

- Calls `GET <baseUrl>?url=https://example.com`.
- Expects Microlink JSON with `status: "success"`.

---

## Actions (Tools)

All tools are Zapier `creates` actions and share the same input fields.  
Each action applies its own default query flags (shown below), then merges optional parameters.

| Action Key | Label | File | Auto Query Params |
|-----------|-------|------|-------------------|
| `extract` | Extract | `creates/extract.js` | none |
| `screenshot` | Screenshot | `creates/screenshot.js` | `screenshot=true` |
| `pdf` | PDF | `creates/pdf.js` | `pdf=true` |
| `markdown` | Markdown | `creates/markdown.js` | `force=true`, `meta=false`, `embed=markdown`, `data.markdown.attr=markdown` |
| `text` | Text | `creates/text.js` | `force=true`, `meta=false`, `embed=text`, `data.text.attr=text` |
| `audio` | Audio | `creates/audio.js` | `audio=true` |
| `video` | Video | `creates/video.js` | `video=true` |
| `insights` | Insights | `creates/insights.js` | `insights=true` |
| `logo` | Logo | `creates/logo.js` | `palette=true` |

### Extract

Returns metadata and extracted data from a URL.

### Screenshot

Generates browser-rendered screenshots. Supports viewport and screenshot options.

### PDF

Generates PDFs. Supports PDF and viewport options.

### Markdown

Returns page content in Markdown format (using Microlink embed extraction).

### Text

Returns page content as plain text (using Microlink embed extraction).

### Audio

Detects playable audio sources.

### Video

Detects playable video sources.

### Insights

Returns performance/technology insights.

### Logo

Returns logo metadata, including palette data via `palette=true`.

---

## Parameters Reference

### Top-level Inputs

| Input Field | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `url` | string | Yes | - | The URL to analyze. |
| `responseMode` | string | No | `auto` | `auto`, `json`, `text`, or `binary`. |
| `binaryProperty` | string | No | `data` | Output property name for binary mode payloads. |

### Response Mode

| Mode | Behavior |
|------|----------|
| `auto` | Returns JSON unless `embed` is present, then returns text payload. |
| `json` | Expects/returns Microlink JSON envelope (`{ status, data, ... }`). |
| `text` | Uses raw HTTP response and returns `{ status: "success", data: "<text>" }` unless Microlink JSON envelope is returned. |
| `binary` | Uses raw HTTP response and returns base64 payload in the configured `binaryProperty` (plus `encoding: "base64"`). If Microlink JSON is returned, it is validated and returned as JSON. |

### Browser and Rendering Options

| Field | Type | Default | Microlink Query Key | Description |
|------|------|---------|---------------------|-------------|
| `adblock` | boolean | `false` | `adblock` | Block ads during rendering. |
| `animations` | boolean | `false` | `animations` | Enable/disable animations. |
| `javascript` | boolean | `true` | `javascript` | Enable JavaScript execution. |
| `prerender` | boolean | `false` | `prerender` | Render with browser prerendering. |
| `click` | string | - | `click` | CSS selector to click before capture. |
| `scroll` | string | - | `scroll` | Scroll instruction (`1000`, `#selector`, etc.). |
| `waitForSelector` | string | - | `waitForSelector` | Wait for selector to appear. |
| `waitForTimeout` | number | `0` | `waitForTimeout` | Wait fixed milliseconds before capture. |
| `waitUntil` | string | - | `waitUntil` | Navigation event (`load`, `domcontentloaded`, `networkidle0`, `networkidle2`). |
| `device` | string | - | `device` | Device emulation name. |
| `colorScheme` | string | - | `colorScheme` | Force light/dark color scheme. |
| `mediaType` | string | - | `mediaType` | CSS media type (`screen` / `print`). |
| `scripts` | string | - | `scripts` | External scripts to inject. |
| `styles` | string | - | `styles` | CSS to inject. |
| `modules` | string | - | `modules` | ES modules to inject. |
| `function` | string | - | `function` | Function to execute in page context. |

### Data and Response Options

| Field | Type | Default | Microlink Query Key | Description |
|------|------|---------|---------------------|-------------|
| `meta` | boolean | `true` | `meta` | Include metadata in response. |
| `audio` | boolean | `false` | `audio` | Include audio extraction. |
| `video` | boolean | `false` | `video` | Include video extraction. |
| `insights` | boolean | `false` | `insights` | Include insights extraction. |
| `logo` | boolean | `false` | `palette` | Include logo/palette data. |
| `pdf` | boolean | `false` | `pdf` | Enable PDF output. |
| `screenshot` | boolean | `false` | `screenshot` | Enable screenshot output. |
| `filter` | string | - | `filter` | Filter response fields. |
| `embed` | string | - | `embed` | Return one embedded field directly. |
| `filename` | string | - | `filename` | Output filename hint. |
| `force` | boolean | `false` | `force` | Bypass cache. |

### Caching and Network Options

| Field | Type | Default | Microlink Query Key | Description |
|------|------|---------|---------------------|-------------|
| `proxy` | string | - | `proxy` | Proxy mode or URL. |
| `retry` | number | `0` | `retry` | Retry attempts. |
| `timeout` | number | `0` | `timeout` | Max timeout in milliseconds. |
| `ttl` | number | `0` | `ttl` | Cache TTL in seconds. |
| `staleTtl` | number | `0` | `staleTtl` | Stale TTL in seconds. |
| `ping` | boolean | `false` | `ping` | Warm cache / ping endpoint. |

### Viewport Options

| Field | Type | Default | Microlink Query Key |
|------|------|---------|---------------------|
| `viewportWidth` | number | `0` | `viewport.width` |
| `viewportHeight` | number | `0` | `viewport.height` |
| `viewportDeviceScaleFactor` | number | `0` | `viewport.deviceScaleFactor` |
| `viewportIsMobile` | boolean | `false` | `viewport.isMobile` |
| `viewportHasTouch` | boolean | `false` | `viewport.hasTouch` |
| `viewportIsLandscape` | boolean | `false` | `viewport.isLandscape` |

### PDF Options

| Field | Type | Default | Microlink Query Key |
|------|------|---------|---------------------|
| `pdfFormat` | string | - | `pdf.format` |
| `pdfWidth` | string | - | `pdf.width` |
| `pdfHeight` | string | - | `pdf.height` |
| `pdfLandscape` | boolean | `false` | `pdf.landscape` |
| `pdfMargin` | string | - | `pdf.margin` |
| `pdfPageRanges` | string | - | `pdf.pageRanges` |
| `pdfScale` | number | `0` | `pdf.scale` |

### Screenshot Options

| Field | Type | Default | Microlink Query Key |
|------|------|---------|---------------------|
| `screenshotType` | string | - | `screenshot.type` |
| `screenshotFullPage` | boolean | `false` | `screenshot.fullPage` |
| `screenshotElement` | string | - | `screenshot.element` |
| `screenshotOmitBackground` | boolean | `false` | `screenshot.omitBackground` |
| `screenshotOverlayBackground` | string | `linear-gradient(225deg, #FF057C 0%, #8D0B93 50%, #321575 100%)` | `screenshot.overlay.background` |
| `screenshotOverlayBrowser` | string | `dark` | `screenshot.overlay.browser` |
| `screenshotCodeScheme` | string | - | `screenshot.codeScheme` |

### JSON Options

These fields accept JSON objects (as text in Zapier UI). They are parsed and flattened into dot notation.

| Field | Type | Default | Query Prefix | Description |
|------|------|---------|--------------|-------------|
| `headersJson` | text (JSON object) | `{}` | `headers.*` | Additional outbound HTTP headers. |
| `dataJson` | text (JSON object) | `{}` | `data.*` | Custom extraction rules. |
| `metaJson` | text (JSON object) | `{}` | `meta.*` | Custom metadata extraction config. |
| `viewportJson` | text (JSON object) | `{}` | `viewport.*` | Nested viewport configuration. |
| `insightsJson` | text (JSON object) | `{}` | `insights.*` | Nested insights configuration. |

Validation:

- If JSON is invalid or not an object, the app throws `InvalidInput` (`400`).

### Additional Query Parameters

`additionalParams` is a line-item input where each item has:

- `key` (string)
- `value` (string)

Behavior:

- Dot-notation keys are supported (for example, `data.author.selector`).
- Values are loosely parsed:
  - `"true"` / `"false"` -> boolean
  - numeric strings -> number
  - JSON strings -> object/array
- Objects are flattened recursively into dot-notation query params.
- Additional params are applied last and can override built-in options.

---

## Query-Building Rules

Implemented in `lib/microlink.js`.

1. Start with action defaults (for example `pdf=true` for PDF action).
2. Merge common input options.
3. Merge JSON options (`dataJson`, `metaJson`, etc.) into existing objects.
4. Flatten object-like params (`data`, `meta`, `headers`, `viewport`, `insights`).
5. Apply `additionalParams` last.
6. Nested keys win for boolean-or-object fields:
   - if `screenshot.*` exists, remove top-level `screenshot`
   - if `pdf.*` exists, remove top-level `pdf`
   - if `insights.*` exists, remove top-level `insights`
7. Empty values are skipped (`undefined`, `null`, empty string, numeric `0`).

---

## Error Handling

All request execution is centralized in `performMicrolinkRequest`.

- HTTP failures (`>=400`) -> throws `z.errors.Error` with parsed Microlink message when available.
- Microlink JSON payload with `status !== "success"` -> throws `z.errors.Error`.
- Invalid JSON object fields (for `*Json` inputs) -> throws `InvalidInput` with status `400`.
- Raw-text and binary modes still detect and validate Microlink JSON envelopes when returned.

---

## How to Use in Zapier CLI

1. Install dependencies:

```bash
npm install
```

2. Validate app:

```bash
npx zapier validate
```

3. Run tests:

```bash
npm test
```

4. Log in to Zapier CLI (if not already):

```bash
npx zapier login
```

5. Push a new app version:

```bash
npx zapier push
```

6. In Zapier editor:

- Choose one of the 9 create actions.
- Fill `url`.
- Optionally set auth (`apiKey`) and advanced params.
- Use `responseMode` according to output you need (`json`, `text`, or `binary`).

---

## Testing

Tests use:

- `zapier-platform-core` `createAppTester`
- `nock` for API mocking
- `mocha` test runner

### Run All Tests

```bash
npm test
```

### Run Tests for One Action

```bash
npx mocha test/creates/extract.test.js
npx mocha test/creates/screenshot.test.js
npx mocha test/creates/pdf.test.js
npx mocha test/creates/markdown.test.js
npx mocha test/creates/text.test.js
npx mocha test/creates/audio.test.js
npx mocha test/creates/video.test.js
npx mocha test/creates/insights.test.js
npx mocha test/creates/logo.test.js
```

### Test Structure

```text
test/
  helpers.js
  creates/
    extract.test.js
    screenshot.test.js
    pdf.test.js
    markdown.test.js
    text.test.js
    audio.test.js
    video.test.js
    insights.test.js
    logo.test.js
```

---

## Project Structure

```text
.
├── authentication.js
├── index.js
├── creates/
│   ├── action-factory.js
│   ├── extract.js
│   ├── screenshot.js
│   ├── pdf.js
│   ├── markdown.js
│   ├── text.js
│   ├── audio.js
│   ├── video.js
│   ├── insights.js
│   └── logo.js
├── lib/
│   ├── input-fields.js
│   └── microlink.js
└── test/
    ├── helpers.js
    └── creates/*.test.js
```

---

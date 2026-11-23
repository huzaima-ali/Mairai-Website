import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeArticleHtml } from "./sanitize.ts";

test("CMS tables keep structure, column widths, and cell alignment", () => {
  const html = [
    "<p>Intro</p>",
    '<table style="min-width: 200px">',
    '<colgroup><col style="width: 120px"><col style="min-width: 25px"></colgroup>',
    "<tbody>",
    '<tr><th colspan="1" rowspan="1" colwidth="120" style="text-align: left"><p>Name</p></th><th><p>Role</p></th></tr>',
    '<tr><td><p>Ada</p></td><td style="text-align: center"><p>Lead</p></td></tr>',
    "</tbody></table>",
  ].join("");

  const out = sanitizeArticleHtml(html);
  assert.match(out, /<table/);
  assert.match(out, /<colgroup/);
  assert.match(out, /<th/);
  assert.match(out, /colwidth="120"/);
  assert.match(out, /text-align:left/);
  assert.match(out, /Ada/);
});

test("CMS table line visibility and color survive sanitization", () => {
  const out = sanitizeArticleHtml(
    '<table data-lines="grid" data-line-color="#c7253e"><tr><td>ok</td></tr></table>',
  );
  assert.match(out, /data-lines="grid"/);
  assert.match(out, /data-line-color="#c7253e"/);
  assert.match(out, /--table-line-color:#c7253e/);
});

test("unsafe table line attributes are dropped", () => {
  const out = sanitizeArticleHtml(
    '<table data-lines="javascript:alert(1)" data-line-color="url(javascript:alert(1))"><tr><td>ok</td></tr></table>',
  );
  assert.doesNotMatch(out, /javascript/i);
  assert.doesNotMatch(out, /data-lines/);
  assert.doesNotMatch(out, /data-line-color/);
});

test("unsafe table markup is stripped while cell text remains", () => {
  const out = sanitizeArticleHtml(
    '<table onclick="alert(1)"><tr><td><script>alert(1)</script>ok<img src="x" onerror="alert(1)"></td></tr></table>',
  );
  assert.doesNotMatch(out, /onclick/i);
  assert.doesNotMatch(out, /<script/i);
  assert.doesNotMatch(out, /onerror/i);
  assert.match(out, /ok/);
});

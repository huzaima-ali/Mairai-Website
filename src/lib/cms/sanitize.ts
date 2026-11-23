import sanitizeHtml from "sanitize-html";

const TABLE_STYLE_WIDTH = [/^\d+(?:\.\d+)?(?:px|%)$/, /^auto$/];
const TABLE_STYLE_MIN_WIDTH = [/^\d+(?:\.\d+)?px$/];
const TABLE_TEXT_ALIGN = [/^(?:left|right|center)$/];
const TABLE_LINE_COLOR_STYLE = [/^#[0-9a-fA-F]{3}$/, /^#[0-9a-fA-F]{6}$/];
const TABLE_LINE_MODES = new Set(["off", "rows", "grid"]);
const TABLE_LINE_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function allowedTableLines(value?: string) {
  return value && TABLE_LINE_MODES.has(value) ? value : null;
}

function allowedTableLineColor(value?: string) {
  const color = value?.trim() || "";
  return TABLE_LINE_COLOR.test(color) ? color.toLowerCase() : null;
}

const ALLOWED_TAGS = [
  "h2",
  "h3",
  "h4",
  "p",
  "strong",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "hr",
  "br",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
];

export function sanitizeArticleHtml(dirty: string) {
  return sanitizeHtml(dirty || "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
      pre: ["class"],
      table: ["style", "class", "data-lines", "data-line-color"],
      colgroup: ["span"],
      col: ["span", "style", "width"],
      th: ["colspan", "rowspan", "colwidth", "style", "align", "scope"],
      td: ["colspan", "rowspan", "colwidth", "style", "align"],
      "*": ["class"],
    },
    allowedStyles: {
      table: {
        width: TABLE_STYLE_WIDTH,
        "min-width": TABLE_STYLE_MIN_WIDTH,
        "--table-line-color": TABLE_LINE_COLOR_STYLE,
      },
      col: {
        width: TABLE_STYLE_WIDTH,
        "min-width": TABLE_STYLE_MIN_WIDTH,
      },
      th: {
        "text-align": TABLE_TEXT_ALIGN,
        width: TABLE_STYLE_WIDTH,
      },
      td: {
        "text-align": TABLE_TEXT_ALIGN,
        width: TABLE_STYLE_WIDTH,
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      table: (tagName, attribs) => {
        const lines = allowedTableLines(attribs["data-lines"]);
        const color = allowedTableLineColor(attribs["data-line-color"]);
        const next = { ...attribs };

        if (lines) next["data-lines"] = lines;
        else delete next["data-lines"];

        if (color) {
          next["data-line-color"] = color;
          const style = String(next.style || "").replace(/;?--table-line-color\s*:\s*[^;]*/gi, "").trim();
          next.style = `${style}${style && !style.endsWith(";") ? ";" : ""}--table-line-color:${color}`;
        } else {
          delete next["data-line-color"];
        }

        return { tagName, attribs: next };
      },
    },
  });
}

export function plainTextFromHtml(html: string) {
  return sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

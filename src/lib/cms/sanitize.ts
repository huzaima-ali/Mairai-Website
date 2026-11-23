import sanitizeHtml from "sanitize-html";

const TABLE_STYLE_WIDTH = [/^\d+(?:\.\d+)?(?:px|%)$/, /^auto$/];
const TABLE_STYLE_MIN_WIDTH = [/^\d+(?:\.\d+)?px$/];
const TABLE_TEXT_ALIGN = [/^(?:left|right|center)$/];

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
      table: ["style", "class"],
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
    },
  });
}

export function plainTextFromHtml(html: string) {
  return sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

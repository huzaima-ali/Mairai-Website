/** Shared TipTap Link options for every CMS rich-text field. */
export const CMS_LINK_OPTIONS = {
  /** Do not turn typed domains such as StoryPage.ai into links. */
  autolink: false,
  /** Do not turn pasted plain-text URLs or domains into links. */
  linkOnPaste: false,
  /** Keep the caret in the editor so Edit / Unlink stay available. */
  openOnClick: false,
  HTMLAttributes: {
    rel: "noopener noreferrer",
  },
} as const;

export function normalizeCmsHref(raw: string) {
  return raw.trim();
}

export function canOpenCmsHref(href: string) {
  return /^(https?:\/\/|mailto:|\/)/i.test(href);
}

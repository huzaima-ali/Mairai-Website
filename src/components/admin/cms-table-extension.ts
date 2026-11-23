"use client";

import { Table, TableKit, TableView } from "@tiptap/extension-table";
import type { EditorView } from "@tiptap/pm/view";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { normalizeTableLineColor, normalizeTableLines } from "@/lib/cms/rich-text-table";

function applyCmsTableChrome(table: HTMLTableElement, node: ProseMirrorNode) {
  const lines = normalizeTableLines(node.attrs.lines) || "grid";
  table.setAttribute("data-lines", lines);

  const color = normalizeTableLineColor(node.attrs.lineColor);
  if (color) {
    table.setAttribute("data-line-color", color);
    table.style.setProperty("--table-line-color", color);
    return;
  }

  table.removeAttribute("data-line-color");
  table.style.removeProperty("--table-line-color");
}

class CmsTableView extends TableView {
  constructor(
    node: ProseMirrorNode,
    cellMinWidth: number,
    view?: EditorView,
    HTMLAttributes: Record<string, any> = {},
  ) {
    super(node, cellMinWidth, view, HTMLAttributes);
    applyCmsTableChrome(this.table, node);
  }

  update(node: ProseMirrorNode) {
    const ok = super.update(node);
    if (ok) applyCmsTableChrome(this.table, node);
    return ok;
  }
}

const CmsTable = Table.extend({
  addOptions() {
    return {
      ...this.parent!(),
      resizable: true,
      View: CmsTableView,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      lines: {
        default: "grid",
        parseHTML: (element) =>
          element.hasAttribute("data-lines")
            ? normalizeTableLines(element.getAttribute("data-lines")) || "rows"
            : "rows",
        renderHTML: (attributes) => ({
          "data-lines": normalizeTableLines(attributes.lines) || "grid",
        }),
      },
      lineColor: {
        default: null,
        parseHTML: (element) =>
          normalizeTableLineColor(
            element.getAttribute("data-line-color") || element.style.getPropertyValue("--table-line-color"),
          ),
        renderHTML: (attributes) => {
          const color = normalizeTableLineColor(attributes.lineColor);
          if (!color) return {};
          return { "data-line-color": color };
        },
      },
    };
  },
});

export const cmsTableExtensions = [
  TableKit.configure({ table: false }),
  CmsTable,
];

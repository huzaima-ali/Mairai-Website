"use client";

import { useState, useTransition } from "react";
import { softDeleteMediaAction, updateMediaAltAction, uploadMediaAction } from "@/lib/cms/actions";
import type { MediaAssetRow } from "@/lib/cms/types";
import { formatAdminDate } from "@/lib/cms/utils";

export function MediaManager({ assets }: { assets: MediaAssetRow[] }) {
  const [items, setItems] = useState(assets);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>(
    Object.fromEntries(assets.map((a) => [a.id, a.alt_text])),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        className="rounded-2xl border border-black/8 bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          setMessage(null);
          startTransition(async () => {
            try {
              const uploaded = await uploadMediaAction(formData);
              setItems((prev) => [uploaded as MediaAssetRow, ...prev]);
              setAltDrafts((prev) => ({ ...prev, [uploaded.id]: uploaded.alt_text || "" }));
              setMessage("Upload complete.");
              form.reset();
            } catch (err) {
              setMessage(err instanceof Error ? err.message : "Upload failed");
            }
          });
        }}
      >
        <h2 className="text-lg font-medium">Upload</h2>
        <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WebP, AVIF · max 5MB</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            File
            <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="mt-1.5 block w-full text-sm" />
          </label>
          <label className="block flex-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Alt text
            <input name="alt_text" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <button type="submit" disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {pending ? "Uploading…" : "Upload"}
          </button>
        </div>
        {message ? <p className="mt-3 text-sm">{message}</p> : null}
      </form>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((asset) => (
          <li key={asset.id} className="overflow-hidden rounded-2xl border border-black/8 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.public_url} alt={asset.alt_text || asset.file_name} className="aspect-video w-full object-cover bg-zinc-100" />
            <div className="space-y-2 p-4">
              <p className="truncate text-sm font-medium">{asset.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatAdminDate(asset.created_at)} · {Math.round(asset.byte_size / 1024)} KB
              </p>
              <input
                value={altDrafts[asset.id] ?? ""}
                onChange={(e) => setAltDrafts((prev) => ({ ...prev, [asset.id]: e.target.value }))}
                className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm"
                placeholder="Alt text"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs"
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await updateMediaAltAction(asset.id, altDrafts[asset.id] || "");
                        setMessage("Alt text saved.");
                      } catch (err) {
                        setMessage(err instanceof Error ? err.message : "Save failed");
                      }
                    });
                  }}
                >
                  Save alt
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs"
                  onClick={() => navigator.clipboard.writeText(asset.public_url)}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-700"
                  onClick={() => {
                    if (!window.confirm("Delete this asset? Warn if still referenced.")) return;
                    startTransition(async () => {
                      try {
                        await softDeleteMediaAction(asset.id);
                        setItems((prev) => prev.filter((i) => i.id !== asset.id));
                      } catch (err) {
                        setMessage(err instanceof Error ? err.message : "Delete failed");
                      }
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

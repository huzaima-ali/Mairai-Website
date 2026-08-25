import { MediaManager } from "@/components/admin/MediaManager";
import { listMediaAdmin } from "@/lib/cms/media";

export default async function AdminMediaPage() {
  const assets = await listMediaAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Media</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload images for featured art, inline article media and OG images.
        </p>
      </div>
      <MediaManager assets={assets} />
    </div>
  );
}

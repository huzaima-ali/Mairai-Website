export function exclusiveHomepageFeatured(
  currentFeaturedId: string | null,
  nextArticleId: string | null,
  articles: Array<{ id: string; status: string }>,
): { featuredId: string | null; error?: string } {
  if (!nextArticleId) return { featuredId: null };
  const article = articles.find((item) => item.id === nextArticleId);
  if (!article) return { featuredId: currentFeaturedId, error: "Article not found" };
  if (article.status !== "published") {
    return { featuredId: currentFeaturedId, error: "Only published articles can be featured on the homepage" };
  }
  return { featuredId: nextArticleId };
}

export function homepageFeatureFlags(articleIds: string[], featuredId: string | null) {
  return Object.fromEntries(articleIds.map((id) => [id, Boolean(featuredId) && id === featuredId]));
}

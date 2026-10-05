import blogPostsMeta from "./blog-posts.json";
import { blogContents } from "./blog-contents";

// Articles complets (métadonnées + contenu HTML), pour les pages qui affichent un article.
// Les listes n'ont besoin que des métadonnées : importer blog-posts.json directement.
export const blogPosts = blogPostsMeta.map((post) => ({
  ...post,
  content: blogContents[post.id] ?? ""
}));

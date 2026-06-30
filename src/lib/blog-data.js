import { getCollection } from "astro:content";

const siteUrl = (
  import.meta.env.SITE_URL ||
  import.meta.env.PUBLIC_SITE_URL ||
  "https://pages.olivie.space"
).replace(/\/$/, "");

export const authors = [
  {
    slug: "olivie-desk",
    name: "Olivie Desk",
    bio: "Editorial voice behind the site's front page, features, and curated internet picks.",
    longBio:
      "Olivie Desk shapes the front-of-house layer of the site: homepage packages, reading lists, launch notes, and feature stories designed to attract attention before sending readers into the archive or the newsletter.",
    avatar: "https://i.pravatar.cc/200?img=47",
  },
  {
    slug: "chen",
    name: "Chen",
    bio: "Builder, curator, and operator working across personal sites, tools, and editorial systems.",
    longBio:
      "Chen works at the intersection of independent publishing, product thinking, and internet infrastructure. Most notes begin with a domain, a workflow, or a publishing problem worth simplifying.",
    avatar: "https://i.pravatar.cc/200?img=12",
  },
  {
    slug: "guest-notes",
    name: "Guest Notes",
    bio: "Occasional outside voices, observations, and small interviews that fit the site's taste.",
    longBio:
      "Guest Notes is a flexible byline for conversations, collaborative pieces, and field observations that add range without turning the site into a multi-author publication.",
    avatar: "https://i.pravatar.cc/200?img=32",
  },
];

export const categories = [
  { slug: "essays", name: "Features" },
  { slug: "design", name: "Interface" },
  { slug: "engineering", name: "Build Notes" },
  { slug: "field-notes", name: "Dispatches" },
  { slug: "interviews", name: "Conversations" },
];

export const tags = [
  { slug: "writing", name: "Writing" },
  { slug: "typography", name: "Type" },
  { slug: "minimalism", name: "Restraint" },
  { slug: "tools", name: "Tools" },
  { slug: "travel", name: "Places" },
  { slug: "process", name: "Workflow" },
  { slug: "web", name: "Web" },
  { slug: "books", name: "Reading" },
];

const isoDate = (date) => date?.toISOString().slice(0, 10);

export const imageSrc = (image) => (typeof image === "string" ? image : image?.src);

export const normalizePost = (entry) => ({
  slug: entry.id,
  ...entry.data,
  date: isoDate(entry.data.date),
  updated: isoDate(entry.data.updated),
});

export const posts = async () => (await getCollection("blog")).map(normalizePost);

export const getPost = async (slug) => (await posts()).find((post) => post.slug === slug);
export const getAuthor = (slug) => authors.find((author) => author.slug === slug);
export const getCategory = (slug) => categories.find((category) => category.slug === slug);
export const getTag = (slug) => tags.find((tag) => tag.slug === slug);
export const postsByCategory = async (slug) =>
  (await sortedPosts()).filter((post) => post.category === slug);
export const postsByTag = async (slug) =>
  (await sortedPosts()).filter((post) => post.tags.includes(slug));
export const postsByAuthor = async (slug) =>
  (await sortedPosts()).filter((post) => post.author === slug);
export const sortedPosts = async () =>
  [...(await posts())].sort((a, b) => (a.date < b.date ? 1 : -1));
export const featuredPost = async () => {
  const sorted = await sortedPosts();
  return sorted.find((post) => post.featured) ?? sorted[0];
};
export const popularPosts = async () => (await sortedPosts()).slice(0, 4);
export const relatedPosts = async (post, n = 3) =>
  (await sortedPosts())
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const score = (candidate) =>
        (candidate.category === post.category ? 2 : 0) +
        candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      return score(b) - score(a);
    })
    .slice(0, n);

export const adjacentPosts = async (post) => {
  const sorted = await sortedPosts();
  const index = sorted.findIndex((candidate) => candidate.slug === post.slug);
  return { prev: sorted[index + 1], next: sorted[index - 1] };
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const SITE = {
  name: "Olivie Pages",
  description:
    "A visual front page for features, dispatches, and the internet things worth keeping.",
  url: siteUrl,
};

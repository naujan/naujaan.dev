import { getCollection, type CollectionEntry } from 'astro:content';

type FeaturedEntry = CollectionEntry<'posts'> | CollectionEntry<'projects'>;
export const featuredOrder = (a: FeaturedEntry, b: FeaturedEntry) =>
  a.data.order - b.data.order || a.id.localeCompare(b.id);
export async function publishedPosts() {
  const now = new Date();
  return (await getCollection('posts', ({ data }) => !data.draft && data.date <= now))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}
export async function publishedProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(featuredOrder);
}
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);


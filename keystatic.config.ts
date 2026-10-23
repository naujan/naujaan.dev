import { config, fields, collection, singleton } from '@keystatic/core';

const image = () => fields.image({ label: 'Cover image', directory: 'public/images/content', publicPath: '/images/content/' });
const shared = () => ({
  title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
  description: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
  cover: image(),
  coverAlt: fields.text({ label: 'Image description' }),
  draft: fields.checkbox({ label: 'Draft — hide from website', defaultValue: true }),
  featured: fields.checkbox({ label: 'Featured on homepage' }),
  order: fields.integer({ label: 'Featured order (lowest first)', defaultValue: 10, validation: { min: 0 } }),
  sample: fields.checkbox({ label: 'Show sample content label', defaultValue: false }),
  tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: p => p.value }),
  content: fields.markdoc({ label: 'Content' }),
});
export default config({
  storage: import.meta.env.DEV && import.meta.env.PUBLIC_KEYSTATIC_GITHUB_MODE !== 'true'
    ? { kind: 'local' }
    : { kind: 'github', repo: 'naujan/naujaan.dev' },
  ui: { brand: { name: 'naujaan.dev' } },
  collections: {
    posts: collection({
      label: 'Blog posts', slugField: 'title', path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: { ...shared(), date: fields.date({ label: 'Publish date', validation: { isRequired: true } }) },
    }),
    projects: collection({
      label: 'Projects', slugField: 'title', path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        ...shared(),
        year: fields.text({ label: 'Year' }),
        repository: fields.url({ label: 'Repository URL' }),
        demo: fields.url({ label: 'Live demo URL' }),
      },
    }),
  },
  singletons: {
    about: singleton({
      label: 'About & timeline', path: 'src/content/about', format: { data: 'json' },
      schema: {
        heading: fields.text({ label: 'Heading', validation: { isRequired: true } }),
        intro: fields.text({ label: 'Introduction', multiline: true }),
        note: fields.text({ label: 'Personal note', multiline: true }),
        certificates: fields.array(fields.object({
          image: fields.image({ label: 'Certificate PNG', directory: 'public/images/certificates', publicPath: '/images/certificates/' }),
        }), { label: 'Certificates (drag to reorder)', itemLabel: () => 'Certificate image' }),
        timeline: fields.array(fields.object({
          period: fields.text({ label: 'Date or period' }),
          title: fields.text({ label: 'Title', validation: { isRequired: true } }),
          description: fields.text({ label: 'Description', multiline: true }),
        }), { label: 'Timeline (drag to reorder)', itemLabel: p => p.fields.title.value }),
      },
    }),
    settings: singleton({
      label: 'Site & contact', path: 'src/content/settings', format: { data: 'json' },
      schema: {
        github: fields.url({ label: 'GitHub profile' }),
        linkedin: fields.url({ label: 'LinkedIn profile (optional)' }),
        email: fields.text({ label: 'Contact email (optional)' }),
        footer: fields.text({ label: 'Footer message' }),
      },
    }),
  },
});


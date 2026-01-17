# Docusaurus plugin to generate JSON-LD structured data (schema.org) for SEO

A Docusaurus plugin that automatically generates JSON-LD structured data (schema.org) for your documentation site's SEO. This plugin scans your markdown/MDX files for front matter schema definitions and generates a React Root component that injects the appropriate structured data into each page.

## Features

- 🎯 **Automatic Schema Generation**: Extracts schema definitions from markdown front matter
- 🌐 **JSON-LD Output**: Generates valid schema.org JSON-LD for SEO
- 🌍 **i18n Support**: Handles multilingual sites with locale-specific schemas
- ⚙️ **Configurable Paths**: Support for custom directory structures
- 🔍 **Multiple Schema Types**: Support for Article, BlogPosting, Organization, Person, Service, and more
- 🛡️ **Error Handling**: Graceful error handling and recovery
- 🧪 **Fully Tested**: Comprehensive Jest test suite with 14+ tests
- 📝 **Verbose Logging**: Optional detailed logging for debugging
- 🔧 **TypeScript**: Fully typed with TypeScript interfaces

## Installation

```bash
npm install @coffeecup_tech/docusaurus-plugin-structured-data
```

or with yarn:

```bash
yarn add @coffeecup_tech/docusaurus-plugin-structured-data
```

## Configuration

Add the plugin to your `docusaurus.config.js`:

```javascript
module.exports = {
  // ... other config
  plugins: [
    [
      '@coffeecup_tech/docusaurus-plugin-structured-data',
      {
        // Optional: Enable verbose logging
        verbose: false,

        // Optional: Custom directory paths (relative to siteDir)
        srcDir: 'src/pages',
        blogDir: 'blog',
        docsDir: 'docs',

        // Optional: Custom output path for Root.js
        outputFile: 'src/theme/Root.js',

        // Optional: Fallback image URL for schemas without images
        defaultImage: 'https://example.com/default-image.png',

        // Base schema for organization/person/website (optional)
        baseSchema: {
          organization: {
            '@id': '${DOCUSAURUS_CONFIG_URL}/#organization',
            '@type': 'Organization',
            name: 'My Organization',
            url: '${DOCUSAURUS_CONFIG_URL}',
            logo: '${DOCUSAURUS_CONFIG_URL}/logo.png',
            sameAs: '${SAME_AS_DEFAULT}',
          },
          person: {
            '@id': '${DOCUSAURUS_CONFIG_URL}/#person',
            '@type': 'Person',
            name: 'John Doe',
          },
          website: {
            '@id': '${DOCUSAURUS_CONFIG_URL}/#website',
            '@type': 'WebSite',
            name: 'My Website',
            url: '${DOCUSAURUS_CONFIG_URL}',
          },
        },

        // Optional: i18n specific schemas
        i18n: {
          fr: {
            baseSchema: {
              organization: {
                '@id': '${DOCUSAURUS_CONFIG_URL}/#organization',
                '@type': 'Organization',
                name: 'Mon Organisation',
              },
            },
          },
        },

        // Optional: sameAs default values
        sameAsDefault: [
          'https://twitter.com/example',
          'https://github.com/example',
        ],
      },
    ],
  ],
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verbose` | boolean | false | Enable verbose logging during generation |
| `srcDir` | string | 'src/pages' | Path to pages directory (relative to siteDir) |
| `blogDir` | string | 'blog' | Path to blog directory (relative to siteDir) |
| `docsDir` | string | 'docs' | Path to docs directory (relative to siteDir) |
| `outputFile` | string | 'src/theme/Root.js' | Path where Root.js will be written |
| `defaultImage` | string | undefined | Fallback image URL for schemas without images |
| `baseSchema` | object | undefined | Organization/person/website schema structure |
| `i18n` | object | undefined | Locale-specific schema overrides |
| `sameAsDefault` | array | [] | Default sameAs URLs for organization |

## Usage

### Adding Schema to Your Content

Add a `schema` object to the front matter of your markdown/MDX files:

```markdown
---
title: My Blog Post
slug: my-blog-post
description: This is a great blog post
image: /img/my-image.png
date: 2024-01-15
schema:
  type: BlogPosting
  headline: My Blog Post
  description: This is a great blog post
  image: /img/my-image.png
  datePublished: 2024-01-15
  dateModified: 2024-01-15
---

# My Blog Post

Content here...
```

### Supported Schema Types

The plugin automatically enriches the following schema.org types:

- **Article** - General articles with author/publisher
- **BlogPosting** - Blog posts with author/publisher
- **CollectionPage** - Pages that collect other content
- **Blog** - Blog containers
- **AboutPage** - About pages
- **Service** - Services with provider reference
- **WebSite** - Website metadata
- **Organization** - Organization information
- **Person** - Person information

### Running the Generator

The plugin registers a CLI command with Docusaurus:

```bash
npx docusaurus generate-structured-data
```

This command:
1. Scans all markdown/MDX files in configured directories
2. Extracts schema definitions from front matter
3. Generates a Root.js component with JSON-LD structured data
4. Writes the Root.js file to the specified output path

### Automatic Enrichment

The plugin automatically adds:
- **URL**: Current page URL
- **mainEntityOfPage**: WebPage reference for the current page
- **author/publisher**: Organization and person references (for Article types)
- **provider**: Organization reference (for Service types)
- **inLanguage**: Current locale or 'en-US'

## Development

### Build

```bash
npm run build
```

Compiles TypeScript from `src/` to `lib/` directory.

### Watch Mode

```bash
npm run watch
```

Automatically recompiles on file changes.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The test suite includes:
- **Core Functionality Tests**: Directory creation, file generation, configuration
- **Error Handling Tests**: Permission errors, write failures, missing configs
- **Schema Generation Tests**: JSON-LD validation, type handling, i18n support

### Git Workflow

A pre-commit hook is configured with Husky to automatically run `npm run build` before each commit. This ensures the compiled `lib/` directory stays in sync with source code.

Simply commit as usual:

```bash
git add src/
git commit -m "Your message"
# npm run build runs automatically
```

## Examples

### Example 1: Blog Post with Full Metadata

```markdown
---
title: Getting Started with Docusaurus
slug: getting-started-docusaurus
description: A comprehensive guide to setting up Docusaurus
image: /img/docusaurus-hero.png
date: 2024-01-10
schema:
  type: BlogPosting
  headline: Getting Started with Docusaurus
  description: A comprehensive guide to setting up Docusaurus
  image: /img/docusaurus-hero.png
  datePublished: 2024-01-10
  dateModified: 2024-01-15
---

# Getting Started with Docusaurus

Your content here...
```

### Example 2: Documentation Page

```markdown
---
title: API Reference
description: Complete API documentation
schema:
  type: Article
  headline: API Reference
  description: Complete API documentation
---

# API Reference

Documentation content...
```

### Example 3: With i18n

French version (`i18n/fr/...`):

```markdown
---
title: Commencer avec Docusaurus
schema:
  type: BlogPosting
  headline: Commencer avec Docusaurus
  description: Un guide complet pour configurer Docusaurus
---

# Commencer avec Docusaurus

Contenu ici...
```

With the i18n configuration, the plugin will use French-specific schema and locale in the generated JSON-LD.

## Architecture

### Core Flow

1. **Plugin Entry** (`src/index.ts`): Registers the CLI command
2. **Generator** (`src/generator.ts`): Main logic that:
   - Scans markdown/MDX files in docs, blog, and src/pages
   - Extracts front matter schema definitions
   - Generates a React Root component
   - Injects JSON-LD `<script type="application/ld+json">` tags

### Generated Root Component

The plugin generates a React Root component that:
- Uses the Docusaurus router to get the current page URL
- Looks up schema data for the current path
- Enriches the schema with site-wide metadata
- Injects JSON-LD structured data into the page head

## Error Handling

The plugin includes robust error handling:
- **Missing Directories**: Gracefully skips missing source directories
- **File Read Errors**: Logs errors and continues processing other files
- **Directory Creation**: Automatically creates the output directory if missing
- **Write Errors**: Throws clear error messages if the output file cannot be written

All errors are logged appropriately based on the `verbose` flag.

## Performance Considerations

- The plugin scans directories only during generation (not at runtime)
- The generated Root.js is optimized for performance
- JSON-LD data is embedded directly in the page (no additional requests)
- i18n locales are handled efficiently with minimal data duplication

## Troubleshooting

### No schema data is being generated

1. Check that your front matter has a `schema` object
2. Verify the file is `.md` or `.mdx`
3. Ensure the file is in the scanned directories (src/pages, blog, docs)
4. Run with `verbose: true` to see detailed logging

### Routes are not generating schema

1. Verify the `schema.type` is in the supported list
2. Check that the file path matches the generated route
3. Ensure i18n locales are correctly configured

### Permission errors on build

1. Ensure the output directory is writable
2. Check file permissions on the output location
3. Verify disk space is available

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

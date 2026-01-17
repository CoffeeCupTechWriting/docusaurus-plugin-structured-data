# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Docusaurus plugin that generates JSON-LD structured data (schema.org) for SEO. It scans markdown/MDX files in a Docusaurus site for front matter schema definitions and generates a Root component that injects the appropriate structured data into each page.

## Build & Development Commands

```bash
# Build the TypeScript source
npm run build

# Watch mode for development (recompiles on file changes)
npm run watch

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

The plugin compiles from `src/` to `lib/` as JavaScript and TypeScript declaration files. Tests are run with Jest and ts-jest for TypeScript support.

## Git Workflow

A pre-commit hook is configured with Husky to automatically run `npm run build` before each commit. This ensures that the compiled `lib/` directory is always in sync with the source code.

Simply commit as usual:
```bash
git add src/
git commit -m "Your message"
# npm run build runs automatically
```

The build must succeed for the commit to complete. If the build fails, fix the TypeScript errors and try committing again.

## Architecture

### Core Flow

1. **Plugin Entry** (`src/index.ts`): Exports a Docusaurus plugin that registers a CLI command `generate-structured-data`

2. **Generator** (`src/generator.ts`): The main logic that:
   - Scans markdown/MDX files in docs, blog, and src/pages directories (including i18n variants)
   - Extracts front matter `schema` data from each file
   - Generates a React Root component that:
     - Reads the current page URL from router
     - Injects JSON-LD `<script type="application/ld+json">` tags into the page
     - Enriches schema data with site-wide metadata (organization, person, website)

### Key Components

- **Data Extraction**: Processes markdown front matter using `gray-matter` to extract `schema.*` fields (type, headline, image, description, keywords, datePublished, dateModified)

- **Schema Type Handling**: Different schema.org types get different treatment:
  - `Article`, `BlogPosting`, `CollectionPage`, `Blog`, `AboutPage`: Get author/publisher references
  - `Service`, `WebSite`: Get provider reference
  - `Organization`, `Person`: No automatic enrichment

- **i18n Support**: Scans i18n locale directories under `i18n/{locale}/docusaurus-plugin-content-*` and generates locale-specific schema data

- **Output**: Writes a `Root.js` file (default: `src/theme/Root.js`) that serves as the Docusaurus Root component wrapper

### Plugin Configuration

The plugin accepts in `docusaurus.config.js`:
- `baseSchema`: Default organization/person/website schema structure
- `i18n`: Locale-specific schema overrides
- `outputFile`: Custom output path for Root.js (default: `src/theme/Root.js`)
- `defaultImage`: Fallback image URL for schema
- `verbose`: Enable verbose logging during generation
- `srcDir`: Custom path for pages directory (relative to siteDir, default: `src/pages`)
- `blogDir`: Custom path for blog directory (relative to siteDir, default: `blog`)
- `docsDir`: Custom path for docs directory (relative to siteDir, default: `docs`)
- `sameAsDefault`: Array of schema.org properties to use as defaults

### Code Quality & Improvements

**Error Handling**:
- Try/catch blocks around file operations (read, write, directory traversal)
- Automatic creation of output directory if it doesn't exist
- Graceful skipping of missing directories with logging

**TypeScript Interfaces** (since last refactor):
- `DocsaurusContext`: Docusaurus runtime context with type safety
- `PluginOptions`: All plugin configuration options typed
- `FrontMatterSchema`: Front matter schema field definitions
- `FrontMatterData`: Complete front matter structure

**Logging**:
- Centralized `logger()` function for consistent output
- Info-level logs only show with `verbose: true`
- Warning and error logs always display
- Replaces all `console.log/warn/error` calls

**Code Organization**:
- Removed 3 identical wrapper functions (replaced with direct `getData()` calls)
- Schema type handling uses array `includes()` instead of long if/else chains
- Configuration object `SUPPORTED_SCHEMA_TYPES` documents all handled schema.org types

## Testing

The project includes a comprehensive Jest test suite (`src/generator.test.ts`) with 14+ tests covering:

**Core Functionality Tests**:
- ✓ Directory creation when output path doesn't exist
- ✓ Root.js file generation with correct output
- ✓ Custom output file paths
- ✓ Custom directory paths (srcDir, blogDir, docsDir)
- ✓ Verbose logging flag behavior
- ✓ Schema configuration application

**Error Handling Tests**:
- ✓ Permission errors during directory creation
- ✓ Disk write failures
- ✓ Graceful handling of missing configs

**Schema Generation Tests**:
- ✓ Valid JSON-LD structured data output
- ✓ Article schema type handling
- ✓ All schema.org type handlers included
- ✓ i18n locale support

**Test Framework**: Jest with ts-jest for TypeScript support
**Mocking**: fs and path modules are mocked to avoid file I/O during tests
**Coverage**: Tests mock file system operations and validate generated code output

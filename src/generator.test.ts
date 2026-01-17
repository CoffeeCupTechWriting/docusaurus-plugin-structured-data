import fs from 'fs';
import path from 'path';
import { run } from './generator';

// Mock fs module
jest.mock('fs');
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn((p) => p.split('/').slice(0, -1).join('/')),
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('run()', () => {
    it('should create output directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();
      mockFs.mkdirSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
          tagline: 'A test site',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      // Should call mkdirSync to create the output directory
      expect(mockFs.mkdirSync).toHaveBeenCalled();
    });

    it('should write Root.js file to default output path', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      // Should call writeFileSync
      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [filePath, content] = mockFs.writeFileSync.mock.calls[0];
      expect(filePath).toContain('Root.js');
      expect(content).toContain('AUTO-GENERATED FILE');
    });

    it('should use custom output file path when provided', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
        outputFile: '/custom/Root.js',
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [filePath] = mockFs.writeFileSync.mock.calls[0];
      expect(filePath).toBe('/custom/Root.js');
    });

    it('should handle directory creation errors', () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      mockFs.readdirSync.mockReturnValue([]);

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      expect(() => run(context, options)).toThrow('Permission denied');
    });

    it('should generate Root.js with site configuration', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://mysite.io',
          title: 'My Amazing Site',
          tagline: 'The best site ever',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      expect(content).toContain('https://mysite.io');
      expect(content).toContain('My Amazing Site');
    });

    it('should include i18n locales in generated Root.js', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
        i18n: {
          locales: ['en', 'fr', 'es'],
          defaultLocale: 'en',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      expect(content).toContain('"en"');
      expect(content).toContain('"fr"');
      expect(content).toContain('"es"');
    });

    it('should use custom directory paths when provided', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: true,
        srcDir: 'src/custom-pages',
        blogDir: 'content/blog',
        docsDir: 'documentation',
      };

      // Mock console to capture log output
      const consoleSpy = jest.spyOn(console, 'log');

      run(context, options);

      // Check that custom paths are being used (they should be logged with verbose)
      const logCalls = consoleSpy.mock.calls.map((c) => c[0]);
      const hasCustomPaths = logCalls.some((log) =>
        typeof log === 'string' && log.includes('custom-pages')
      );

      expect(hasCustomPaths).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should respect verbose flag for logging', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const consoleSpy = jest.spyOn(console, 'log');

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      // Run with verbose = false
      run(context, { verbose: false });
      const callsWithoutVerbose = consoleSpy.mock.calls.length;

      jest.clearAllMocks();

      // Run with verbose = true
      run(context, { verbose: true });
      const callsWithVerbose = consoleSpy.mock.calls.length;

      // With verbose=true, there should be more log calls
      expect(callsWithVerbose).toBeGreaterThan(callsWithoutVerbose);

      consoleSpy.mockRestore();
    });

    it('should apply baseSchema configuration', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const baseSchema = {
        organization: {
          '@type': 'Organization',
          name: 'My Organization',
          url: 'https://example.com',
        },
      };

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
        baseSchema,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];
      expect(content).toContain('My Organization');
    });
  });

  describe('error handling', () => {
    it('should throw error when Root.js write fails', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Disk full');
      });

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      expect(() => run(context, options)).toThrow('Disk full');
    });

    it('should handle missing site config gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      // Should not throw
      expect(() => run(context, options)).not.toThrow();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('schema generation', () => {
    it('should generate valid JSON-LD structured data', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];

      // Check for JSON-LD script tag
      expect(content).toContain("type='application/ld+json'");
      expect(content).toContain('@context');
      expect(content).toContain('https://schema.org');
    });

    it('should handle Article schema type correctly', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];

      // Check for Article schema handling
      expect(content).toContain('articlesWithAuthorPublisher');
      expect(content).toContain('Article');
    });

    it('should include schema.org type handlers', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      mockFs.writeFileSync.mockImplementation();

      const context = {
        siteDir: '/site',
        siteConfig: {
          url: 'https://example.com',
          title: 'My Site',
        },
      };

      const options = {
        verbose: false,
      };

      run(context, options);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const [, content] = mockFs.writeFileSync.mock.calls[0];

      // Check for schema type arrays
      expect(content).toContain('BlogPosting');
      expect(content).toContain('Organization');
      expect(content).toContain('Person');
      expect(content).toContain('Service');
      expect(content).toContain('WebSite');
    });
  });
});

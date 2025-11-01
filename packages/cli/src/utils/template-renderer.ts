import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { registerHelpers } from './handlebars-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register custom helpers
registerHelpers();

export class TemplateRenderer {
  private templatesDir: string;
  private compiledTemplates: Map<string, HandlebarsTemplateDelegate>;

  constructor() {
    // Templates directory is at packages/templates
    this.templatesDir = path.resolve(__dirname, '../../../templates');
    this.compiledTemplates = new Map();
  }

  /**
   * Render a template file with the given context
   */
  async renderTemplate(templatePath: string, context: any): Promise<string> {
    const fullPath = path.join(this.templatesDir, templatePath);

    // Check if template is already compiled
    if (!this.compiledTemplates.has(fullPath)) {
      const templateContent = await fs.readFile(fullPath, 'utf-8');
      const compiled = Handlebars.compile(templateContent);
      this.compiledTemplates.set(fullPath, compiled);
    }

    const template = this.compiledTemplates.get(fullPath)!;
    return template(context);
  }

  /**
   * Render a template and write to a file
   */
  async renderToFile(templatePath: string, outputPath: string, context: any): Promise<void> {
    const rendered = await this.renderTemplate(templatePath, context);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, rendered, 'utf-8');
  }

  /**
   * Copy and render all templates from a directory
   */
  async renderDirectory(
    templateDir: string,
    outputDir: string,
    context: any,
    options: {
      exclude?: string[];
      filter?: (filename: string) => boolean;
    } = {}
  ): Promise<void> {
    const fullTemplateDir = path.join(this.templatesDir, templateDir);
    const files = await this.getTemplateFiles(fullTemplateDir);

    for (const file of files) {
      // Skip excluded files
      if (options.exclude?.some(pattern => file.includes(pattern))) {
        continue;
      }

      // Apply filter if provided
      if (options.filter && !options.filter(file)) {
        continue;
      }

      const relativePath = path.relative(fullTemplateDir, file);
      const templatePath = path.join(templateDir, relativePath);

      // Remove .hbs extension from output path
      const outputPath = path.join(outputDir, relativePath.replace(/\.hbs$/, ''));

      await this.renderToFile(templatePath, outputPath, context);
    }
  }

  /**
   * Get all template files recursively from a directory
   */
  private async getTemplateFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await this.getTemplateFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Clear compiled template cache
   */
  clearCache(): void {
    this.compiledTemplates.clear();
  }
}

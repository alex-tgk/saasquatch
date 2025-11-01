import Handlebars from 'handlebars';

/**
 * Register custom Handlebars helpers
 */
export function registerHelpers(): void {
  // Helper: Convert to snake_case
  Handlebars.registerHelper('snakeCase', (str: string) => {
    return str.replace(/-/g, '_');
  });

  // Helper: Equality check
  Handlebars.registerHelper('eq', (a: any, b: any) => {
    return a === b;
  });

  // Helper: OR logic
  Handlebars.registerHelper('or', (...args: any[]) => {
    // Last argument is Handlebars options object
    const options = args[args.length - 1];
    const values = args.slice(0, -1);
    return values.some(v => !!v);
  });

  // Helper: AND logic
  Handlebars.registerHelper('and', (...args: any[]) => {
    const options = args[args.length - 1];
    const values = args.slice(0, -1);
    return values.every(v => !!v);
  });

  // Helper: NOT logic
  Handlebars.registerHelper('not', (value: any) => {
    return !value;
  });

  // Helper: JSON stringify
  Handlebars.registerHelper('json', (context: any) => {
    return JSON.stringify(context, null, 2);
  });

  // Helper: Conditional array iteration
  Handlebars.registerHelper('eachIf', function(array: any[], condition: (item: any) => boolean, options: any) {
    let result = '';
    if (array && array.length > 0) {
      array.forEach(item => {
        if (condition(item)) {
          result += options.fn(item);
        }
      });
    }
    return result;
  });
}

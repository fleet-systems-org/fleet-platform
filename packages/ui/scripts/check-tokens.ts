// Fails when a value bypasses the design tokens: raw colours outside src/styles.css, Tailwind palette classes
// or Tailwind arbitrary values. Usage: node scripts/check-tokens.ts [directory...]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const tokenFile = resolve(import.meta.dirname, "../src/styles.css");
const defaultTargets = ["packages/ui/src", "packages/ui/stories", "packages/ui/.storybook", "packages/app/src"];
const extensions = /\.(?:tsx?|css|mdx)$/;
const skipped = new Set(["node_modules", "storybook-static", ".next"]);

const palette = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black";
const checks: { name: string; pattern: RegExp }[] = [
  { name: "raw colour", pattern: /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b(?!\]\()/g },
  { name: "colour function", pattern: /\b(?:rgba?|hsla?|hwb|oklch|oklab|lch|lab)\(/g },
  { name: "Tailwind palette class", pattern: new RegExp(`(?<![\\w-])(?:[\\w-]+:)*-?(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|outline|fill|stroke|from|via|to|divide|placeholder|decoration|accent|caret|shadow)-(?:${palette})(?:-\\d{2,3})?(?:/\\d+)?(?![\\w-])`, "g") },
  { name: "Tailwind arbitrary value", pattern: /(?<![\w-])(?:[\w-]+:)*-?[a-z][\w-]*-\[[^\]\s]+\](?!:)/g },
  // Text is styled by named roles (text-page-title, text-body, text-meta…), never by bare size or weight.
  { name: "text size or weight outside the roles", pattern: /(?<![\w-])(?:[\w-]+:)*(?:text-(?:xs|sm|base|lg|[2-9]?xl)|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black))(?![\w-])/g },
  // One icon set for the product: Tabler Icons.
  { name: "icon library other than Tabler", pattern: /from\s+["'](?:lucide-react|@radix-ui\/react-icons|react-icons[^"']*|@heroicons\/[^"']+|@phosphor-icons\/[^"']+)["']/g },
];

function files(path: string): string[] {
  const stats = statSync(path, { throwIfNoEntry: false });
  if (!stats) return [];
  if (stats.isFile()) return extensions.test(path) ? [path] : [];
  return readdirSync(path).filter(name => !skipped.has(name)).flatMap(name => files(join(path, name)));
}

const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultTargets;
const findings: string[] = [];
for (const file of targets.flatMap(target => files(resolve(root, target)))) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((source, index) => {
    // Comments and inline code in documentation may name forbidden examples; they are not values.
    let line = source.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "$1");
    if (file.endsWith(".mdx")) line = line.replace(/`[^`]*`/g, "");
    for (const { name, pattern } of checks) {
      if (file === tokenFile && (name === "raw colour" || name === "colour function")) continue;
      for (const match of line.matchAll(pattern)) findings.push(`${relative(root, file)}:${index + 1}: ${name}: ${match[0]}`);
    }
  });
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  console.error(`\n${findings.length} value(s) outside the design tokens.`);
  process.exit(1);
}
console.log("No values outside the design tokens.");

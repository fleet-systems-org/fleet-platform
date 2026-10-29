// WCAG 1.4.12 Text Spacing check, shared by documentation blocks and story play functions.
// The criterion requires no loss of content or function when a user sets: line height 1.5 x font size,
// spacing after paragraphs 2 x font size, letter spacing 0.12 x font size and word spacing 0.16 x font size.

const attribute = "data-text-spacing";
const styleId = "wcag-1-4-12-text-spacing";

const overrides = `
[${attribute}] *:not(svg):not(svg *) {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
[${attribute}] p { margin-block-end: 2em !important; }
`;

/** Applies the WCAG 1.4.12 spacing to everything inside `root`; returns a function that removes it. */
export function applyTextSpacing(root: HTMLElement): () => void {
  const document = root.ownerDocument;
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = overrides;
    document.head.append(style);
  }
  root.setAttribute(attribute, "");
  return () => root.removeAttribute(attribute);
}

export type TextSpacingFailure = { element: string; problem: string };

function describe(element: Element): string {
  const text = (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
  return `<${element.tagName.toLowerCase()}> "${text}"`;
}

function hasOwnText(element: Element): boolean {
  return [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "");
}

/**
 * Finds content that the spacing hides: text clipped by an element with hidden or clipped overflow,
 * and text that leaves the box of its parent. Scrollable regions are allowed, because their content stays reachable.
 */
export function findTextSpacingFailures(root: HTMLElement): TextSpacingFailure[] {
  const failures: TextSpacingFailure[] = [];
  const tolerance = 1;
  for (const element of root.querySelectorAll<HTMLElement>("*")) {
    if (element.closest("svg")) continue;
    // A single-line input scrolls its own value; the text stays reachable with the caret, so it is not lost content.
    if (element instanceof HTMLInputElement) continue;
    // Visually hidden text (sr-only, such as a table caption) is for screen readers; it has no visual box to lose.
    if (element.closest(".sr-only")) continue;
    const style = getComputedStyle(element);
    const clipsX = ["hidden", "clip"].includes(style.overflowX);
    const clipsY = ["hidden", "clip"].includes(style.overflowY);
    if (clipsX && element.scrollWidth > element.clientWidth + tolerance) failures.push({ element: describe(element), problem: "text clipped horizontally" });
    if (clipsY && element.scrollHeight > element.clientHeight + tolerance) failures.push({ element: describe(element), problem: "text clipped vertically" });
    if (style.textOverflow === "ellipsis" && element.scrollWidth > element.clientWidth + tolerance) failures.push({ element: describe(element), problem: "text truncated with an ellipsis" });
    const parent = element.parentElement;
    if (!parent || !hasOwnText(element) || !root.contains(parent)) continue;
    const box = element.getBoundingClientRect();
    const parentBox = parent.getBoundingClientRect();
    const parentStyle = getComputedStyle(parent);
    const parentScrolls = ["auto", "scroll"].includes(parentStyle.overflowX) || ["auto", "scroll"].includes(parentStyle.overflowY);
    if (!parentScrolls && (box.right > parentBox.right + tolerance || box.bottom > parentBox.bottom + tolerance)) {
      failures.push({ element: describe(element), problem: "text leaves its container" });
    }
  }
  return failures;
}

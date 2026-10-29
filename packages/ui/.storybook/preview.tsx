import "./storybook.css";
import type { Preview } from "@storybook/react-vite";

// The interface language is Polish; screen readers and the axe checks need it on the document root.
document.documentElement.lang = "pl";

const preview: Preview = {
  parameters: {
    // Accessibility violations fail the story test (WCAG 2.2 AA rules in axe).
    a11y: { test: "error" },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          "Design system", ["Start here", "Components", "How to choose", "Usage and accessibility", "Content", "What to avoid", "What is missing", "Contributing"],
          "Foundations", ["Color", "Typography", "Spacing and layout", "Shape and depth", "Motion", "Icons", "Themes"],
          "Primitives", "Product", "Patterns", "Screens",
        ],
      },
    },
  },
};

export default preview;

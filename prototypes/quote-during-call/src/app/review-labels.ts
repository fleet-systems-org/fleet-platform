// Translate engine-owned chrome after mounting; keep the supplied engine byte-identical.
const labels: Record<string, string> = {
  "Clickable": "Klikanie", "Comment": "Komentowanie", "Show hotspots": "Pokaż przejścia", "Hide hotspots": "Ukryj przejścia",
  "Presentation": "Prezentacja", "Threads": "Wątki", "Hide pins": "Ukryj pinezki", "Show pins": "Pokaż pinezki", "← Back": "← Wstecz (Back)",
  "Comments": "Komentarze", "Close": "Zamknij", "Export for repository": "Eksport do repozytorium", "Export Markdown": "Eksport Markdown (Export Markdown)",
  "Your name for review comments": "Podpis do komentarzy (bez danych osobowych)", "Prototype comments": "Komentarze do prototypu",
  "What should change?": "Co należy zmienić?", "New review comment": "Nowy komentarz", "Add comment": "Dodaj komentarz", "Cancel": "Anuluj",
  "Reply": "Odpowiedz", "Re-anchor": "Przepnij", "Resolve": "Rozwiąż", "Reopen": "Otwórz ponownie", "Delete": "Usuń",
  "Reply to this thread": "Odpowiedź w wątku", "Prototype review mode": "Tryb przeglądu prototypu",
  "No comments yet. Switch to Comment mode and select an element.": "Brak komentarzy. Włącz komentowanie i wybierz element.",
};
export function localizeReview() {
  const translate = () => {
    document.querySelectorAll(".proto-toolbar, .anno-panel, .proto-back, .proto-toast").forEach(root => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        // Do not translate reviewer-authored text.
        if (node.parentElement?.closest(".anno-message-text, textarea")) continue;
        const replacement = labels[node.textContent ?? ""];
        if (replacement) node.textContent = replacement;
      }
      [root, ...root.querySelectorAll("[placeholder], [aria-label]")].forEach(element => {
        for (const attribute of ["placeholder", "aria-label"]) {
          const value = element.getAttribute(attribute);
          if (value && labels[value]) element.setAttribute(attribute, labels[value]);
        }
      });
    });
  };
  translate();
  const observer = new MutationObserver(translate);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return () => observer.disconnect();
}

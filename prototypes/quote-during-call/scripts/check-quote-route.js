// Run this expression in the browser evaluator on an open prototype preview.
// It returns a promise, throws on regression and resets the simulation.
(async () => {
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  function click(root, label) {
    const element = [...root.querySelectorAll('button, a')].find(node => node.textContent.trim() === label);
    if (!element) throw new Error(`Missing action: ${label}`);
    element.click();
  }
  async function pickDetails() {
    click(document, 'Wybierz ekran');
    await settle();
    const link = document.querySelector('#screen-picker a[href="#s13"]');
    if (!link) throw new Error('Missing s13 screen-picker option');
    link.click();
    await settle();
  }
  function check() {
    const screen = document.querySelector('#s13');
    if (!screen || !screen.getBoundingClientRect().height) throw new Error('s13 is not visible');
    const route = screen.querySelector('.route-stops')?.textContent || '';
    for (const expected of ['Auto 01', 'Miejsce A · PL', 'Miejsce B · DE', 'Miejsce C · CZ', '11:00', '12:00', '13:00', '20 km', '80 km']) {
      if (!route.includes(expected)) throw new Error(`K2 route missing: ${expected}`);
    }
    if (/Wybierz auto|Wybierz miejsce/.test(route)) throw new Error('Entry placeholders leaked into K2');
    if (!screen.querySelector('.quote-summary')?.textContent.includes('21,82 EUR')) throw new Error('Missing K2 summary');
  }
  click(document, 'Resetuj symulację');
  await settle();
  await pickDetails();
  check();
  click(document, 'Resetuj symulację');
  await settle();
  await pickDetails();
  check();
  return 'PASS: direct screen-picker entry and repeated simulation reset retain the K2 route and summary';
})()

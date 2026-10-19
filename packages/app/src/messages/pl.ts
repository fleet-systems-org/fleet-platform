export const messages = {
  description: "Narzędzia dla firm handlowych i transportowych.",
  title: "Każdy kurs zaczyna się od dobrego planu.",
  introduction: "Budujemy miejsce, w którym sprawdzisz rentowność kursu i porównasz plan z wykonaniem.",
  status: "Projekt w przygotowaniu",
  adminLink: "Zobacz panel",
  adminTitle: "Panel administracyjny",
  adminDescription: "Miejsce na przyszłe narzędzia zarządzania.",
  adminBody: "Funkcje biznesowe pojawią się po analizie wymagań.",
  back: "Wróć na stronę główną",
};

// Shared UI receives these labels and this translator from the application.
export const apiMessages = {
  "api.methodNotAllowed": "Ta operacja nie jest dostępna.",
  "api.unauthenticated": "Zaloguj się, aby kontynuować.",
  "api.forbidden": "Nie masz uprawnień do tej operacji.",
  "api.validation": "Sprawdź dane formularza.",
  "api.internal": "Nie udało się wykonać operacji. Spróbuj ponownie.",
  "api.jsonRequired": "Żądanie ma nieobsługiwany format.",
  "api.invalidJson": "Nie udało się odczytać danych żądania.",
  "api.notFound": "Nie znaleziono rekordu.",
  "api.conflict": "Dane zostały zmienione. Odśwież je przed ponownym zapisem.",
  "api.invalidPath": "Nieprawidłowy adres żądania.",
  "api.protocol": "Serwer zwrócił nieprawidłową odpowiedź.",
  "api.aborted": "Żądanie zostało anulowane.",
  "api.network": "Nie udało się połączyć z serwerem. Spróbuj ponownie.",
  "validation.invalid": "Sprawdź wartość tego pola.",
} as const;

export function translateApiMessage(key: string): string {
  return Object.hasOwn(apiMessages, key) ? apiMessages[key as keyof typeof apiMessages] : apiMessages["api.internal"];
}

export const crudFormMessages = {
  submit: "Zapisz", cancel: "Anuluj", pending: "Zapisywanie…", success: "Zapisano zmiany.",
  translate: translateApiMessage,
};
export const dataTableMessages = {
  loading: "Wczytywanie…", empty: "Brak wyników.", previous: "Poprzednia", next: "Następna", actions: "Akcje",
  page: (page: number, pages: number) => `Strona ${page} z ${pages}`,
};

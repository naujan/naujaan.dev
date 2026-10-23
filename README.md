# naujaan.dev

Portfolio Astro: Hero, About z timeline, wyróżniony blog, wyróżnione projekty i stopka.
Treść jest przechowywana w repozytorium; nie jest potrzebna baza danych.

## Lokalnie

Node >= 22.22, npm. Instalacja: `npm ci`.

- `npm run dev -- --background` — uruchomienie; użyj adresu wypisanego przez Astro.
- `npm run dev -- status`, `npm run dev -- logs`, `npm run dev -- stop` — obsługa serwera.
- `/keystatic` — panel edycji. Lokalnie zapisuje pliki na dysku.
- `npm run check` — sprawdzanie typów.
- `npm run test:content` — build z tymczasowymi szkicami, test braku ich publikacji i poprawności linków.
- `npm run build` — build statycznych stron i funkcji panelu dla Vercela.

## Edycja treści

W panelu są Blog posts, Projects, About & timeline i Site & contact.

- `Draft` ukrywa wpis na stronie głównej, listach i stronach szczegółów.
- `Featured` pokazuje wpis na stronie głównej; `Featured order` ustawia kolejność (najmniejsza wartość pierwsza).
- Strona główna pokazuje maksymalnie 3 posty i 2 projekty.
- Blog jest sortowany od najnowszych; projekty według kolejności.
- Posty z przyszłą datą są pomijane przy budowaniu. Publikacja w przyszłym terminie wymaga nowego buildu (brak automatycznego harmonogramu).
- Timeline jest listą w About; elementy można przeciągać i zmieniać ich kolejność.
- Obrazy trafiają do `public/images/content`. Dodaj też opis alternatywny.
- Wpisy oznaczone `Sample` są przykładową treścią do zastąpienia lub ukrycia.
- Opcjonalne dane kontaktowe można pozostawić puste.

Pliki: `src/content/posts/*.mdoc`, `src/content/projects/*.mdoc`, `src/content/about.json`, `src/content/settings.json`.
Schemat panelu: `keystatic.config.ts`. Walidacja postów/projektów: `src/content.config.ts`.

## GitHub i Vercel

Repozytorium skonfigurowane w panelu: `naujan/naujaan.dev`.
Publiczne strony są statyczne. `/keystatic` i `/api/keystatic/*` korzystają z funkcji serwerowej adaptera Vercel.

1. Skopiuj `.env.example` do `.env`, ustaw lokalnie `PUBLIC_KEYSTATIC_GITHUB_MODE=true` i zrestartuj serwer.
2. Otwórz `/keystatic` i przejdź przez kreator GitHub App. Instalację ogranicz do tego repozytorium. Wymaga autoryzacji właściciela konta.
3. Zaimportuj repozytorium do Vercela, wybierz preset Astro, Node 24.x i polecenie `npm run build`. Nie nadpisuj ręcznie katalogu wyjściowego adaptera.
4. Dodaj w ustawieniach Vercela cztery wartości wygenerowane przez kreator: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
5. Ustaw poprawny adres witryny i callback GitHub App dla wybranej domeny: `https://TWOJA-DOMENA/api/keystatic/github/oauth/callback`. Po zmianie domeny zaktualizuj konfigurację aplikacji.
6. Wykonaj ponowny deploy i sprawdź logowanie, zapis oraz wynikowy build.

Produkcja zawsze używa trybu GitHub, niezależnie od lokalnego przełącznika. Sekretów nie umieszczaj w kodzie ani w zmiennych z prefiksem `PUBLIC_`.
Zmiany zapisane lokalnie trzeba commitować i wypchnąć. Zmiany zapisane w GitHub mode trafiają do wybranej gałęzi; publiczna strona odświeża się po wdrożeniu gałęzi produkcyjnej przez Vercela.

Konfiguracja kont, sekretów i pierwsze wdrożenie nie zostały wykonane automatycznie.

## Animacje

- `ScrollTransition.astro`: scena Hero, parametry pause/fadeDistance/scaleTo, opcjonalny nagłówek.
- `SectionReveal.astro`: niezależne efekty rise/wipe, uruchamiane przy wejściu w ekran.
- `BackToTop.astro`: płynny powrót na górę i przywrócenie fokusu.
- Mobile i reduced motion mają uproszczony przebieg; bez JS treść pozostaje czytelna.

## Zależności

Override `path-to-regexp` do 6.3.x usuwa podatność w zależności pośredniej adaptera Vercel. Przy aktualizacji adaptera sprawdź, czy override jest nadal potrzebny.

Dokumentacja: https://keystatic.com/docs/github-mode oraz https://docs.astro.build/en/guides/integrations-guide/vercel/

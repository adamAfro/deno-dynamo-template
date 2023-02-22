# Dynamiczny projekt w Deno typescript

Projekt to kilka skryptów które pozwalają na szybkie serwowaniu projektu `.ts`.
Zamysł jest taki żeby bez zbędnych plików wyświetlać typescript w przeglądarce:

* projekt na razie nie robi nic
* serwer wysyła zbundlowane (`esbuild`) skrypty we wnętrzu HTMLa z podstawową stroną
* testy można prowadzić w konsoli dzięki `JSDOM`
* assety może działają może nie, sprawdzi się jak się przydadzą

Zamysł jest taki, żeby to wykorzystać do robienia gierki w `.ts`ie
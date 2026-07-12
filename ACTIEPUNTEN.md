# Tuinbazen — Actiepunten (laatst bijgewerkt: 2026-06-10)

De website ziet er goed uit en is bijna klaar voor livegang. Hieronder wat er nog moet
gebeuren, opgesplitst in "wat jij doet" en "wat Claude de volgende keer kan doen".

## ✅ Al gedaan
- Huisstijlkleur naar warm aardebruin (`#7D4E24`).
- "50+ tevreden klanten" op hero, USP en reviews-pagina.
- Echte Google-reviews handmatig als kaarten op reviews.html gezet.
- Buttons "Bekijk alle reviews op Google" en "Bekijk alle Werkspot reviews" in website-stijl (groene outline).
- SEO: LocalBusiness-schema, Service-schema (8 dienst-pagina's), canonicals (alle pagina's), sitemap.xml, robots.txt.
- Hero-regel = link naar Werkspot-reviews; "Eerder werk"-lightbox gerepareerd; aanpak-raster gecentreerd/responsief.
- Contactformulier omgebouwd naar Web3Forms (nog activeren, zie hieronder).
- Afbeeldingen geoptimaliseerd naar **WebP** (~49% lichter, 12 MB bespaard). De originele `.jpg`'s
  blijven als backup in `img/` staan (niet meer gebruikt door de site, behalve `hero-siertuin.jpg`
  die nog dienstdoet als `og:image` voor social previews).

## 👉 Wat JIJ moet doen
- [ ] **Domein kiezen en koppelen.** Geef het echte domein door → Claude vervangt overal het
      placeholder-domein `https://www.tuinbazen.nl` (in canonicals, schema, sitemap.xml, robots.txt)
      en maakt og:image/og:url absoluut.
- [ ] **Google Search Console** aanmaken, site verifiëren en `sitemap.xml` indienen.
      → Het verificatie-tagje plak je in het kant-en-klare blok in de `<head>` van index.html
        (zoek op "GOOGLE SEARCH CONSOLE"). Verificatie alleen op de homepage volstaat.
- [ ] **Google Bedrijfsprofiel "Tuinen die verbazen"** claimen/optimaliseren: categorieën, foto's,
      openingstijden, adres. (Grootste hefboom om lokaal gevonden te worden.)
- [ ] **Trustindex** (trustindex.io) account maken → Google-profiel koppelen → embed-snippet aan
      Claude geven. De plek staat al klaar (tussen `<!-- TRUSTINDEX:START -->` / `END` op
      reviews.html én index.html). Dan worden de Google-reviews live + automatisch bijgewerkt.
- [ ] **Contactformulier activeren (Web3Forms):** ga naar https://web3forms.com, vul
      vandenbergdennis2@gmail.com in → "Create Access Key" → plak de key in contact.html
      (zoek op "PLAK-HIER-JE-WEB3FORMS-ACCESS-KEY"). Daarna komen aanvragen daar binnen.
- [ ] **Review Hilde Bours** controleren: tekst was in de screenshot afgekapt en is licht aangevuld
      ("...komt zijn afspraken na"). Even tegen de volledige Google-tekst leggen.
- [ ] (Optioneel) **Straatadres + openingstijden** aanleveren → dan maakt Claude de schema compleet.

## 🤖 Wat CLAUDE de volgende keer kan doen
- [ ] **`aggregateRating`** in de schema zetten zodra het echte Google-review-aantal bekend is
      (geeft kans op sterren in de zoekresultaten).
- [ ] **404.html** maken (eigen foutpagina).
- [ ] Kleine toegankelijkheid: **skip-link** + `aria-current` op de actieve navigatie.
- [ ] **Trustindex-snippet inbouwen** zodra jij het aanlevert.

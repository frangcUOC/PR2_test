PR2 – Visualització interactiva: Contaminació, PIB i Mortalitat a Europa

Autor: Francisco Garcia Caparrós


Aquesta és la segona part de la pràctica del Màster de Ciència de Dades de la UOC. L’objectiu és construir una visualització interactiva que permeti explorar la relació entre:

- Emissions contaminants per càpita (kg/habitant)

- PIB per càpita

- Mortalitat per causes respiratòries, sanguínies, càncer de pulmó, i demència i Alzheimer.

- Evolució temporal (2013–2023)

- Diferències entre països europeus

La visualització inclou un mode exploratori i un mode narratiu amb un sliders verticals per explorar diferents capítols explicatius.

Tecnologies utilitzades

- HTML5 i CSS3

- JavaScript

- D3.js  v7

- GitHub Pages per al desplegament

Estructura del repositori

index.html - Pàgina principal
chart.html - Visualització del gràfic de dispersió
css/index.css - Estils de la pàgina de la narrativa
css/chart.css - Estils de la visualització del gràfic de dispersió
svg/Blank_map_of_Europe_cropped.svg - Mapa en format svg d'Europa
data/final_data_wide_env.csv - Conjunt de dades principal
src/main.js - Codi que gestiona la interacció de la narrativa amb els iframes dels gràfics
src/chart/autoplay.js - Gestiona la reproducció de la visualització
src/chart/chart.js - Gestiona la creació i actualització del gràfic
src/chart/filters.js - Gestiona les consultes al conjunt de dades principal
src/chart/gui.js - Gestiona el tipus de visualització que es mostrarà del gràfic
src/chart/main.js - Gestiona la càrrega del gràfic de dispersió
src/chart/listeners.js - Gestiona els listeners associats als diferents objectes
src/chart/messages.js - Gestiona els avisos que provenen del gràfic
src/chart/sliders.js - Codi que gestiona els diferents selectors que fan de filtre pel gràfic

Recursos visuals addicionals

Com executar el projecte

Es pot executar el projecte mitjançant la versió desplegada a GitHub Pages:
https://frangcuoc.github.io/M2.959_PR2/

Funcionalitats principals

Mode exploratori:

- Selecció de contaminant

- Slider temporal

- Filtres per PIB i emissions

- Tooltip amb dades detallades

- Gràfic de dispersió ressaltat pel PIB

Mode narratiu:

- Contextualització de l'apartat d'emissions i PIB

- Sliders vertical amb 5 i 4 capítols

- Caixes de text sincronitzades amb el gràfic

- Explicació guiada de patrons i anomalies

- Conclusions

Dataset

El dataset final_data_wide_dis.csv conté:

- Emissions per càpita en kg/habitant

- PIB per càpita

- Mortalitat per les causes indicades anteriorment

- Països europeus

- Període 2013–2023

Les dades provenen de fonts oficials d’Eurostat.

Llicència

Projecte d’ús acadèmic. El codi es pot reutilitzar amb finalitats educatives.
/**
 * @file src/chart/filters.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Gestió dels filtres dels sliders
 *
 * Funcions principals:
 * - Aplica els filtres obtinguts dels sliders al conjunt de dades.
 *
 */

/**
 * Dades inicials i càrrega del slider de contaminants
 */
function preLoad(){

    // Definició de variables i constants locals necessàries pels filtres
    let allColumns;

    // Assignem el valor del primer any per a la primera càrrega
    currentYear = d3.min(original_data, d => d.TIME_PERIOD);

    // Calculem el rang global del PIB per càpita
    globalPIBMin = Math.floor(d3.min(original_data, d => d.PIB_per_capita) / 1000) * 1000;
    globalPIBMax = Math.ceil(d3.max(original_data, d => d.PIB_per_capita) / 1000) * 1000;

    // Obtenim les columnes i filtrem. Obtindrem el contaminant per poblar l'slider corresponent
    allColumns = Object.keys(data[0]);
    pollutantList = allColumns.filter(col => {
        const isExcluded = [
            "PIB_per_capita",
            "mort_rate_100",
            "TIME_PERIOD",
            "geo",
            "Country_name"
        ].includes(col);

        const looksLikePollutant =
            /^PM\d+(_\d+)?$/i.test(col) ||
            /^NOX$/i.test(col) ||
            /^SOX$/i.test(col) ||
            /^CO$/i.test(col) ||
            /^NH3$/i.test(col) ||
            /^NMVOC$/i.test(col);

        return !isExcluded && looksLikePollutant;
    });

    // Definim els camps bàsics del nostre conjunt de dades
    specialFields = {
        country: "geo",
        country_name: "Country_name",
        year: "TIME_PERIOD",
        mortality: "mort_rate_100",
        pib: "PIB_per_capita"
    };
    //Assignem el contaminant actual mitjançant el seu slider
    currentPollutant = pollutantList[(pollutantList.length - 1) - (+document.getElementById("pollutantSlider").value)];

    //Amb les dades bàsiques, es crea l'slider vertical d'emissions i de malalties
    setPollutantSlider();
    setDiseasesSlider();

}

/**
 * Aplica els filtres i obté el conjunt de dades amb totes les opcions dels sliders seleccionades
 */
function applyFilter() {

    // Definició de variables locals
    let result = null;

    // Obtenim les dades amb els filtres dels sliders
    result = queryFilter(original_data)

    //Assignem el contaminant actual mitjançant el seu slider
    if(currentPollutant == null){
        currentPollutant = pollutantList[(pollutantList.length - 1) - (+document.getElementById("pollutantSlider").value)];
    }
    // Actualitzem la mortalitat actual
    currentMaxMortality = d3.max(result, d => d.mort_rate_100);

    // Assignem el conjunt de dades final a la variable global
    data = result;

}

/**
 * Aplica els filtres al conjunt de dades i els retorna
 * @param {Object[]} base - Conjunt de dades per aplicar els filtres
 */
function queryFilter(base){

    //Filtre per any (només per al gràfic)
    let result = base.filter(d => d.TIME_PERIOD === currentYear);

    // Filtre per sexe/edat/malaltia
    const activeKeys = Object.keys(filtDict)
        .filter(k => filtDict[k] !== "Tots" && filtDict[k] !== "Totes" && filtDict[k] !== "");

    activeKeys.forEach(key => {
        result = result.filter(d => d[key] === filtDict[key]);
    });


    // Acumulat de morts i mitjana des de l'any actual cap enrere
    const acumulatFiltrat = base
        .filter(d => d.TIME_PERIOD <= currentYear)
        .filter(d => d.PIB_per_capita <= currentPIBThreshold)
        .filter(d => activeKeys.every(k => d[k] === filtDict[k]));

        agg_deaths_mean = 0;
        agg_deaths_total = d3.sum(acumulatFiltrat, d => d.total_deaths);
        if (agg_deaths_total > 0) {
            agg_deaths_mean = d3.mean(acumulatFiltrat, d => d.total_deaths);
        }


    // Agrupació, igual que en R
    const groupedData = d3.rollups(
        result,
        v => ({
            geo: v[0].geo,
            Country_name: v[0].Country_name,
            mort_rate_100: d3.mean(v, d => d.mort_rate_100),
            PIB_per_capita: d3.mean(v, d => d.PIB_per_capita),
            PM2_5: d3.mean(v, d => d.PM2_5),
            NOX: d3.mean(v, d => d.NOX),
            SOX: d3.mean(v, d => d.SOX),
            PM10: d3.mean(v, d => d.PM10),
            CO: d3.mean(v, d => d.CO),
            NH3: d3.mean(v, d => d.NH3),
            NMVOC: d3.mean(v, d => d.NMVOC),
            total_deaths_sum: d3.sum(v, d => d.total_deaths),
            total_deaths_mean: d3.mean(v, d => d.total_deaths)
        }),
        d => d.Country_name,
        d => d.TIME_PERIOD
    );

    // Obtenim un format semblant a un json
    result = [];
    groupedData.forEach(([country_name, years]) => {
        years.forEach(([year, vals]) => {
            result.push({
                geo: vals.geo,
                Country_name: country_name,
                TIME_PERIOD: +year,
                ...vals
            });
        });
    });

    // Actualitzem els valors del pollutants i PIB per l'escala del seu slider
    globalPIBMin = Math.floor(d3.min(result, d => d.PIB_per_capita) / 1000) * 1000;
    globalPIBMax = Math.ceil(d3.max(result, d => d.PIB_per_capita) / 1000) * 1000;

    globalPollMin = d3.min(result, d => d[currentPollutant]);
    globalPollMax = d3.max(result, d => d[currentPollutant]);

    // Si l'usuari no toca l'slider del PIB o està ajustant els altres sliders,
    // l'ajustarem amb els colors de l'escala del PIB
    if(!pibSliderSelected){
        // Valor màxim
        currentPIBThreshold = d3.max(result, d => d.PIB_per_capita);
    }
    result = result.filter(d => d.PIB_per_capita <= currentPIBThreshold);

    return result;
}

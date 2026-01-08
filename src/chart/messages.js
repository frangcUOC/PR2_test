/**
 * @file src/chart/messages.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Funcions que mostren el nombre de morts i alertes quan s'han sobrepassat certs llindars
 *
 * Funcions principals:
 * - Actualitzar el nombre total i mitjana de morts
 * - Revisar llindars establerts per destacar-los per pantalla.
 */

/**
 * Calcula el total i mitjana de morts, anual i acumulat
 */
function updateDeathNumbers() {

    //Extracció de dades de l'any
    const deaths_total = d3.sum(data, d => d.total_deaths_sum);
    let deaths_mean = d3.mean(data, d => d.total_deaths_mean);


    // En cas que l'any no tingui valors
    if (deaths_total === 0) {
        deaths_mean = 0;
    }

    if(currentYear === d3.min(original_data, d => d.TIME_PERIOD)){
        agg_deaths_total = deaths_total;
        agg_deaths_mean = deaths_mean;
    }

    // Posem els valors a l'HTML
    d3.select("#totalDeaths_year")
        .html(`<span class="indicator-label">Total morts ${currentYear}:</span> ${formatMilesNoDec(deaths_total)}`);
    d3.select("#averageDeaths_year")
        .html(`<span class="indicator-label">Mitjana morts ${currentYear}:</span> ${formatMiles(deaths_mean)}`);

    d3.select("#totalDeaths")
        .html(`<span class="indicator-label">Total acumulat:</span> ${formatMilesNoDec(agg_deaths_total)}`);
    d3.select("#averageDeaths")
        .html(`<span class="indicator-label">Mitjana acumulada:</span> ${formatMiles(agg_deaths_mean)}`);
}

/**
 * Revisa un llindar establert i destaca als punts que el superen
 */
function checkMortalityThreshold() {

    // Si el paràmetre està a 0 o a null voldrà dir que no estem en mode narratiu, així que establirem
    // un llindar del 90%.

    if(currentMaxMortality != null){
        if(!storyMode){
            mortalityThreshold = +currentMaxMortality * 0.9;
        }
        // Punts que han excedit el llindar
        const exceeded = visibleData.filter(d => d[specialFields.mortality] > mortalityThreshold);

        // Si hem obtingut més de 0 punts que han excedit
        if (exceeded.length > 0) {
            // Els destaquem
            highlightPoints(exceeded);
        } else {
            // En cas contrari, netegem
            clearHighlightedPoints();
        }
    }

}

/**
 * Retorna el format original dels punts que s'han destacat
 * @param {string} exceeded punts que han excedit el llindar
 */
function highlightPoints(exceeded) {
    d3.selectAll("circle")
        .classed("highlighted-point", d => exceeded.includes(d))
        .classed("blinking-point", d => exceeded.includes(d));
}


/**
 * Retorna el format original dels punts que s'han destacat
 */
function clearHighlightedPoints() {
    d3.selectAll("circle")
        .classed("highlighted-point", false)
        .classed("blinking-point", false);
}


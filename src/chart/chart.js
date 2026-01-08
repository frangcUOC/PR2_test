/**
 * @file src/chart/chart.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Estableix el gràfic principal i les posteriors actualitzacions
 *
 * Funcions principals:
 * - Crear el gràfic principal
 * - Actualitzar el gràfic quan es fan canvis als sliders.
 */



/**
 * Dibuixa el gràfic principal amb les dades obtingudes d'applyFilter().
 */
function setupChart(width, height, margin) {

    let xValue =`${currentPollutant.replace("_", " ")} — emissions per càpita (kg/habitant)`;
    // Inicialitzem el dibuix del gràfic
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;
    svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
    chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    x = d3.scaleLinear()
        .domain(d3.extent(data, d => d[currentPollutant]))
        .nice()
        .range([0, innerWidth]);

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.mort_rate_100)])
        .nice()
        .range([innerHeight, 0]);

    // Creació de l'eix X
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x).tickFormat(formatMiles));

    // Creació de l'eix Y
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(formatSmart));

    // En funció del mode, la llegenda de les x serà d'emissions o PIB
    if(currentMode === "pib"){
        xValue = "PIB per càpita (€)";
    }

    // Creació de les etiquetes
    chart.append("text")
        .attr("class", "x-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text(xValue);

    chart.append("text")
        .attr("class", "y-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Taxa de mortalitat per 100.000 habitants (mitjana anual)");


    // Creem els tooltips
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")

    // Actualitzem el gràfic
    updateChart();
}


/**
 * Actualitza el gràfic principal amb les dades obtingudes d'applyFilter() obtingudes dels sliders.
 */
function updateChart() {

    // Variables locals
    let circles = null;
    let enter = null;
    let merged = null;
    let fillValue = specialFields.pib;
    let fillScale = d3.scaleLinear().domain([globalPIBMin, globalPIBMax]).range([color1, color2]);
    let minValue = globalPIBMin;
    let maxValue = globalPIBMax;

    // Constant per a la transició dels punts
    const transition_time = 150;

    // Si prèviament estava el missatge que no hi havia dades
    chart.selectAll(".no-data-msg").remove();


    // S'actualitza el text de l’any
    document.getElementById("yearDisplay").textContent = currentYear;


    // Si el dataset de les dades està buit, mostrem un missatge informatiu
    if (data.length === 0) {
        chart.append("text")
            .attr("class", "no-data-msg")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("fill", "#555")
            .text("No hi ha dades amb els filtres seleccionats");
    }

    // Actualitzem la variable glogal de les dades visibles per poder reutilitzar-la en altres mètodes
    visibleData = data;

    // Actualitzem les escales
    updateAxis()

    // Creació de nous punts
    circles = chart.selectAll("circle")
        .data(data, d => d.geo);
    enter = circles.enter()
        .append("circle")
        .attr("opacity", 0)
        .attr("r", 0);

    // Assigna i actualitza els nous cercles
    merged = enter.merge(circles);

    // Colors dels punts en funció del mode a la narrativa. L'escala de colors anirà canviant a mesura
    // que avancin els anys
    if(currentMode === "emissions" && storyMode){
        fillScale = d3.scaleLinear()
            .domain([globalPollMin, globalPollMax])
            .range([color1, color2]);
        fillValue = currentPollutant;
        minValue = globalPollMin;
        maxValue = globalPollMax;

    }

    setPibSliderColors(fillScale, minValue, maxValue);
    // Si és la primera càrrega o una actualització posterior, primer apliquem els atributs comuns

    // Actualització de les propietats visuals i valors
    merged
        .attr("opacity", 0.8)
        .attr("r", 7)
        .attr("cx", d => x(d[currentPollutant]))
        .attr("cy", d => y(d[specialFields.mortality]))
        .attr("fill", d => fillScale(d[fillValue]));

    // Si NO és la primera càrrega, afegim els esdeveniments i la transició
    if (!firstRender) {
        // Propietats, mètodes, valors i transicions
        merged
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                    .html(tooltipHTML(d));
            })
            .on("mousemove", event => {
                tooltip.style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            })
            .transition()
            .duration(transition_time)
            // Només animem els atributs que realment canvien
            .attr("cx", d => x(d[currentPollutant]))
            .attr("cy", d => y(d[specialFields.mortality]))
            .attr("fill", d => fillScale(d[fillValue]));
    }

    // Establim a fals perquè ja s'ha fet la primera càrrega
    firstRender = false;

    // Eliminem els punts antics que no estaran a la nova actualització
    circles.exit().remove();


    // Etiquetes de text dels punts
    const labels = chart.selectAll(".point-label")
        .data(data, d => d.geo);

    // Eliminem les etiquetes antigues
    labels.exit().remove();

    // Actualitzem les etiquetes amb els valors
    labels.enter()
        .append("text")
        .attr("class", "point-label")
        .merge(labels)
        .attr("x", d => x(d[currentPollutant]) + 10)   // Perquè es vegin allunyades del punt
        .attr("y", d => y(d[specialFields.mortality]) + 3)
        .text(d => d.geo)
        .style("font-size", "10px")
        .style("fill", "#333")
        .style("pointer-events", "none"); // Perquè no es solapin amb el tooltip


    // Actualitzem els indicadors de mortalitat
    updateDeathNumbers()

    // Destaquem els punts que superen el llindar
    checkMortalityThreshold();
}

/**
 * Actualitza les escales del gràfic.
 */
function updateAxis(){
    // Actualitzem els dominis de l'escala segons el mode actual
    if (currentMode === "emissions") {
        x.domain(d3.extent(data, d => d[currentPollutant])).nice();
    } else{
        x.domain(d3.extent(data, d => d.PIB_per_capita)).nice();
    }

    // Actualitzem el domini de l'escala de la mortalitat
    y.domain([0, currentMaxMortality]).nice();

    // Actualitzem valors de les escales
    chart.select(".x-axis")
        .call(d3.axisBottom(x).tickFormat(formatMilesNoDec));

    chart.select(".y-axis")
        .call(d3.axisLeft(y).tickFormat(formatSmart));
}

/**
 * Retorna els tooltips dels punts del gràfic.
 * @param {Object[]} d - Conjunt de dades
 */
function tooltipHTML(d) {

    // Recuperem els literals correctes dels valors del gènere i l'edat
    let filtValues = checkFilters();

    //En funció del mode, mostrarem el tooltip amb el valor del contaminant o el PIB
    let html_return =  `<strong>${d[specialFields.country_name]}</strong><br>
    Any: ${d[specialFields.year]}<br>
    Mortalitat: ${formatMiles(d[specialFields.mortality])}<br>
    Contaminant: ${currentPollutant.replace("_", ".")}: ${formatMiles(d[currentPollutant])}<br>
    Gènere: ${filtValues[1]}<br>
    Edat: ${filtValues[0]}<br>
    Causa: ${filtValues[2]}`;

    if (currentMode !== "emissions") {
        html_return = `<strong>${d[specialFields.country_name]}</strong><br>
    Any: ${d[specialFields.year]}<br>
    Mortalitat: ${formatMiles(d[specialFields.mortality])}<br>
    PIB per capita: ${formatEuro(d[specialFields.pib])}<br>
    Gènere: ${filtValues[1]}<br>
    Edat: ${filtValues[0]}<br>
    Causa: ${filtValues[2]}`;

    }
    return html_return;
}

/**
 * Retorna els literals dels filtres del gràfic per mostrar-los als tooltips
 */
function checkFilters(){

    // Valors a retornar, per defecte, tots els filtres seleccionats
    let values =  ["Totes", "Tots", "Totes"];

    // Per posar el valor correcte del literal de l'edat i el sexe
    if(filtDict.age !== "Totes" && filtDict.age !== ""){
        const dict_age ={"Y_LT15":"< 15", "Y15-29": "15-29", "Y30-44":"30-44", "Y45-64": "45-64", "Y_GE65": ">65"};
        values[0] = dict_age[filtDict.age];
    }

    if(filtDict.sex === "M"){
        values[1] = "Homes";
    }
    else if (filtDict.sex=== "F"){
        values[1] = "Dones";
    }

    if(filtDict.Disease_type !== ""){
        values[2] = filtDict.Disease_type;
    }

    return values;
}

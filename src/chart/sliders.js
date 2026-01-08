/**
 * @file src/chart/sliders.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Gestiona els listeners dels Sliders de la visualització
 *
 * Funcions principals:
 * - Actualitzar l’estat global segons el valor dels sliders
 * - Gestionar la reproducció quan l’usuari interactua
 * - Aplicar filtres i refrescar el gràfic
 * - Gestionar l'slider del mode (Emissions o PIB).
 * - Gestiona les etiquetes dels sliders i els colors de l'escala de l'slider del PIB.
 */


/**
 * Controla el slider d’any.
 * Actualitza currentYear, aplica filtres i refresca el gràfic i l'eslider del PIB.
 */
document.getElementById("yearSlider").addEventListener("input", event => {
    //Si està en play, l'aturem
    if (isPlaying) {
        resetAutoPlay("pause");
    }

    // Actualitzem el valor de l'slider i l'any actual
    event.target.value = Math.round(event.target.value);
    currentYear = Math.round(event.target.value);

    // Apliquem filtres, actualitzem l'slider del pib i el gràfic
    if(!storyMode){
        mortalityThreshold = 0;
    }
    applyFilter();
    setPibSlider();
    updateChart();
});

/**
 * Controla el slider de PIB.
 * Actualitza el llindar de PIB, aplica filtres i actualitza el gràfic.
 */
document.getElementById("pibSlider").addEventListener("input", function () {

    pibSliderSelected = false;
    if(+this.value !== +this.max){
        pibSliderSelected = true;
        currentPIBThreshold = +this.value;
    }
    // Apliquem filtres i actualitzem el gràfic
    mortalityThreshold = 0;
    applyFilter();
    updateChart();
});


/**
 * Controla el slider de sexe.
 * Assigna el valor seleccionat, aplica filtres i actualitza el gràfic.
 */
document.getElementById("sexSlider").addEventListener("input", function () {

    // Obtenim el valor del gènere
    const sexOptions = ["Tots", "M", "F"];
    filtDict.sex = sexOptions[+this.value];

    // Apliquem filtres i actualitzem el gràfic si no estem en mode narrativa
    if(!storyMode) {
        mortalityThreshold = 0;
        applyFilter();
        updateChart();
    }
});

/**
 * Controla el slider d’edat.
 * Actualitza el grup d’edat seleccionat, aplica filtres i actualitza el gràfic.
 */
document.getElementById("ageSlider").addEventListener("input", function () {

    // Obtenim el valor de l'edat
    const ageOptions = ["Totes", "Y_LT15", "Y15-29", "Y30-44", "Y45-64", "Y_GE65"];
    filtDict.age = ageOptions[+this.value];

    // Apliquem filtres i actualitzem el gràfic si no estem en mode narrativa
    if(!storyMode){
        mortalityThreshold = 0;
        applyFilter();
        updateChart();
    }
});


/**
 * Controla el slider de malalties.
 * Actualitza el codi de malaltia seleccionada, aplica filtres i actualitza el gràfic.
 */
document.getElementById("diseaseSlider").addEventListener("input", function () {

    if(!firstRender){
        // Obtenim el valor de la malaltia
        filtDict.Disease_type = diseaseList[+this.value];

        // Apliquem filtres i actualitzem el gràfic si no estem en mode narrativa
        if(!storyMode) {
            mortalityThreshold = 0;
            applyFilter();
            updateChart();
        }
    }
});

/**
 * Controla el slider de contaminant.
 * Actualitza el contaminant actiu, actualitza l'slider i el gràfic.
 */
document.getElementById("pollutantSlider").addEventListener("input", event => {

    // Si estem en mode emissions, actualitzem l'slider i el contaminant actual
    if (currentMode === "emissions") {
        const index = (pollutantList.length - 1) - +event.target.value;
        currentPollutant = pollutantList[index];

        // Actualitzem la llegenda de l'escala de les abscisses si no és la primera càrrega
        if (!firstRender){
            document.querySelector(".x-label")
                .textContent = `${currentPollutant.replace("_", ".")} - emissions per càpita (kg/habitant)`;
        }

        // Actualitzem el gràfic si no estem en mode narrativa
        if(!storyMode) {
            updateChart();
        }
    }
});

/**
 * Controla el slider del mode que, pot ser el d'Emissions o PIB
 * Gestiona la visibilitar de l'slider d'emissions i el valor que apareix a l'eix de les abcisses.
 */
document.getElementById("xModeSlider").addEventListener("input", event => {

    // Variable local per definir líndex del contaminant actual
    let index;

    // Assignem el mode actual
    const modes = ["emissions", "pib"];
    let textValue = null;
    currentMode = modes[+event.target.value]

    // Estils del slider quan estem en mode emissions
    if (currentMode === "emissions") {
        document.getElementById("pollutantSliderContainer").style.pointerEvents ="auto";
        document.getElementById("pollutantSliderTitle").textContent = "Contaminant"
        document.getElementById("pollutantSlider").classList.remove("hide-thumb");
        document.getElementById("pollutantSliderTitle").style.opacity = "1";

        // Obtenim el contaminant actual per actualitzar l'eix de les x
        index = (pollutantList.length - 1) - +document.getElementById("pollutantSlider").value;
        currentPollutant = pollutantList[index];

        textValue = `${currentPollutant.replace("_", ".")} - emissions per càpita (kg/habitant)`;

    } else{
        // Si no estem amb contaminants, actualitzem l'slider dels contaminants a desactivat
        document.getElementById("pollutantSliderContainer").style.pointerEvents ="none";
        document.getElementById("pollutantSliderTitle").textContent ="Contaminant (desactivat)"
        document.getElementById("pollutantSlider").classList.add("hide-thumb");
        document.getElementById("pollutantSliderTitle").style.opacity = "0.4";

        // Actualitzem l'eix de les X
        currentPollutant = "PIB_per_capita";
        textValue = "PIB per càpita (€)";
    }

    // Actualitzem el literal del valor de l'eix de les X si no és la primera carrega
    if(!firstRender){
        document.querySelector(".x-label").textContent = textValue;
    }

    // Actualitzem el gràfic si no estem en mode narrativa
    if(!storyMode){
        updateChart();
    }
});

/**
 * Gestiona les etiquetes de l'slider de les malalties amb els valors d'aquestes.
 */
function setDiseasesSlider() {


    // Obtenim les malalties úniques del conjunt original
    let uniqueDiseases = [...new Set(original_data.map(d => d.Disease_type))];
    uniqueDiseases.sort();

    // Creem un vector pels futurs canvis.
    diseaseList = ["Totes", ...uniqueDiseases];

    // Etiquetes de l'eslider
    const diseaseLabels = document.getElementById("diseaseLabels");
    // S'inicialitza en blanc per si es torna a cridar
    diseaseLabels.innerHTML = "";

    // Afegim les etiquetes
    diseaseList.forEach(name => {
        const span = document.createElement("span");
        span.textContent = name;
        diseaseLabels.appendChild(span);
    });

    // Inicialitzem l'slider amb la primera opció
    const diseaseSlider = document.getElementById("diseaseSlider");
    diseaseSlider.min = 0;
    diseaseSlider.max = diseaseList.length - 1;
    diseaseSlider.value = 0;

    // Assignem totes, ja que estem a la primera càrrega
    currentDisease = diseaseList[0];
}

/**
 * Gestiona les etiquetes de l'slider del PIB.
 */
function setPibSlider() {

    // Constants de l'eslider i les seves etiquetes
    const pibSlider = document.getElementById("pibSlider");
    const pibLabels = document.getElementById("pibLabels");
    let minValue = globalPIBMin;
    let maxValue = globalPIBMax;
    let message = "PIB per càpita";
    let step = 1000;
    let formatLabel = v => formatEuro(v);
    let value = null;
    let maxAllowed = globalPIBMax;
    let divSlider = null;

    // Guardem el valor seleccionat per si l'usuari el selecciona i així no es perd a l'actualitzar
    const previousPibValue = pibSlider.value;

    if(storyMode && currentMode === "emissions"){
        minValue = globalPollMin;
        maxValue = globalPollMax;
        message = "Emissions (kg/hab)"
        step = (maxValue - minValue) / 100;
        formatLabel = v => v.toFixed(0);
        maxAllowed = maxValue;
    }


    // Si els valors mínim i màxim de l'escala no estan definits mostrem un missatge. Això és perquè
    // el conjunt filtrat pot no retornar dades.

    if(isNaN(minValue) || isNaN(maxValue))
    {
        document.getElementById("pibSliderTitle").textContent = "Sense dades";
    } else {
        // En cas contrari, actualitzem l'slider
        document.getElementById("pibSliderTitle").textContent = message;
        pibSlider.min = minValue;
        pibSlider.max = maxValue;
        pibSlider.step = step;

        // Si l’usuari ha tocat el slider, mantenim el seu valor
        if (pibSliderSelected) {
            pibSlider.value = Math.min(previousPibValue, maxAllowed);
            currentPIBThreshold = +pibSlider.value;
        } else {
            // Si no l’ha tocat, el posem al màxim
            pibSlider.value = maxAllowed;
            currentPIBThreshold = maxAllowed;
        }

        // Inicialitzem en blanc
        pibLabels.innerHTML = "";

        // Assignem les etiquetes
        for (let i = 0; i < pibSliderSteps; i++) {
            value = maxValue - i * ((maxValue - minValue) / (pibSliderSteps - 1));
            divSlider = document.createElement("div");
            divSlider.className = "pibLabel";
            divSlider.textContent = formatLabel(value);
            pibLabels.appendChild(divSlider);
        }
    }
}

/**
 * Gestiona els colors de les etiquetes de l'slider del PIB.
 */
function setPibSliderColors(scale, minValue, maxValue){

    // Si l'eslider està a dalt de tot
    if(!pibSliderSelected && !isPlaying){
        const pibSlider = document.getElementById("pibSlider");
        pibSlider.style.background = `linear-gradient(to top, ${scale(minValue)}, ${scale(maxValue)})`;
    }

}

/**
 * Gestiona les etiquetes de l'slider de contaminants
 */
function setPollutantSlider(){

    // Definim els objectes de l'slider i les seves etiquetes
    const pollutantSlider = document.getElementById("pollutantSlider");
    const pollutantLabels = document.getElementById("pollutantLabels");
    let divPollutant = null;

    // L'inicialitzem
    pollutantLabels.innerHTML = "";

    // Obtenim el total de contaminants
    const total = pollutantList.length;

    // Omplim les etiquetes
    pollutantList.forEach(pollutant => {
        divPollutant = document.createElement("div");
        divPollutant.className = "pollutantLabel";
        divPollutant.textContent = pollutant.replace("_", ".");
        pollutantLabels.appendChild(divPollutant);
    });

    // Establim els valors inicials de l'slider

    pollutantSlider.min = 0;
    pollutantSlider.max = total - 1;
    pollutantSlider.step = 1;
    pollutantSlider.value = total - 1;
}
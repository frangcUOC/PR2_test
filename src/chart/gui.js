/**
 * @file src/chart/gui.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Gestió de la invocació del gràfic
 *
 * Funcions principals:
 * - Carrega el gràfic des de les crides de la pàgina de la narrativa.
 * - Canvia el mode de visibilitat per alguns objectes dels gràfics
 */


/**
 * Càrrega amb filtres amagats per poder incrustar-lo a la narrativa
 */
function storyModeRun(options){

    // Grandària del gràfic en l'iframe de les narratives
    let width = 600;
    let height = 500;
    let margin = { top: 10, right: 0, bottom: 50, left: 0 };


    init(width, height, margin, options, true)

}

/**
 * Canvia els estils del CSS per ocultar certs objectes per a la narrativa
 */
function hideControls(level){

    // Ocultem sliders i altres objectes que no faran falta a la narrativa
    document.getElementById("europeIndicators").style.display = "none";
    document.getElementById("pibSliderContainer").style.right = "145px";
    document.getElementById("pollutantSliderContainer").style.display = "none";
    document.getElementById("demographicFilters").style.display = "none";
    document.getElementById("xModeSliderContainer").style.display = "none";
    document.getElementById("graphTitle").style.display = "none";
    document.getElementById("yearDisplay").style.marginTop = "0px";
    document.getElementById("chart").style.marginTop = "50px"
    document.getElementById("chartWrapper").style.left = "0px";
    document.getElementById("pibSlider").classList.add("hide-thumb");


    // Passem el color de fons de chart.html a transparent
    document.body.style.backgroundColor = bodyBackgroundColor;
}

/**
 * Recull les crides fetes per l'slider d'històries  de la narrativa
 */
window.addEventListener("message", (event) => {

    // Escenaris per a la narrativa
    const chartOptions = {
        0: [2, 0, 0, 0, "emissions", 2013, 2023, 200],
        1: [1, 4, 1, 2, "emissions", 2019, 2023, 60],
        2: [6, 4, 2, 3, "emissions", 2019, 2023, 3],
        3: [0, 2, 1, 4, "emissions", 2013, 2023, 1],
        4: [5, 5, 0, 5, "emissions", 2013, 2023, 150],
        5: [0, 0, 0, 0, "pib", 2013, 2023, 150],
        6: [0, 3, 1, 1, "pib", 2019, 2023, 20],
        7: [0, 4, 2, 2, "pib", 2019, 2023, 50],
        8: [0, 5, 2, 5, "pib", 2013, 2023, 150]};

    const level = event.data.level;
    if (level !== undefined) {
        if(firstRender) {
            // Ocultem els controls de l'explorador que no es faran servir a la narrativa
            hideControls(level);
            // Creem gràfic si és la primera càrrega
            storyModeRun(chartOptions[level]);
        } else {
            // Actualitzem
            setCustomFilters(chartOptions[level]);
        }
    }
});

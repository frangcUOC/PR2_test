/**
 * @file src/chart/main.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description
 * Entrada principal de l’aplicació. Carrega el conjunt de dades
 * inicial i converteix els valors numèrics. Inicialitza el primer any i
 * crida a les funcions necessàries per carregar la visualització.
 *
 * Funcions principals executades:
 * - Càrrega, neteja i filtratge del conjunt de dades
 * - Inicialització del conjunt de dades i l'any inicial
 * - Crida a la funció de configuració dels sliders dels sliders (PIB, contaminant, malalties)
 * - Inicialització del gràfic D3
 * - Inici de la reproducció.
 */

/**
 * Carrega de dades i crida a les altres funcions que inicialitzen el gràfic
 */
function init(width, height, margin, options = null){

    d3.csv(main_dataset).then(raw => {

        // Conversió a nombre dels atributs numèrics
        data = raw.map(d => {
            const entry = {};
            for (const key in d) {
                const value = d[key];
                if (!isNaN(value) && value.trim() !== "") {
                    entry[key] = +value;
                } else {
                    entry[key] = value;
                }
            }
            return entry;
        });

        //Guardem el dataset original a la variable global per a la seva reutilització
        original_data = data;

        //Primera càrrega per les emissions
        applyFilter();

        // Slider vertical del PIB
        setPibSlider();

        //Slider vertical d'emissions
        setPollutantSlider();

        // Slider vertical de malalties
        setDiseasesSlider();

        // Dibuixem gràfic
        setupChart(width, height, margin);

        // Actualitzem els colors
        setPibSliderColors();

        // Si hi ha filtres
        if (options != null){
            storyMode = true;
            setCustomFilters(options);
        } else {
            // Iniciem la reproducció sense filtres
            startAutoplay();
        }
    });
}
/**
 * Estableix filtres personalitzats al gràfic
 */
function setCustomFilters(options){

    // Filtres predefinits
    document.getElementById("pollutantSlider").value = options[0];
    document.getElementById("ageSlider").value = options[1];
    document.getElementById("sexSlider").value = options[2];
    document.getElementById("diseaseSlider").value = options[3];
    document.getElementById("xModeSlider").value = options[4];

    // Assignem els valors
    document.getElementById("xModeSlider").dispatchEvent(new Event("input"));
    document.getElementById("pollutantSlider").dispatchEvent(new Event("input"));
    document.getElementById("ageSlider").dispatchEvent(new Event("input"));
    document.getElementById("sexSlider").dispatchEvent(new Event("input"));
    document.getElementById("diseaseSlider").dispatchEvent(new Event("input"));

    mortalityThreshold = options[7];
    if(options[4] !== 0){
        currentMode = "pib";
    }

    // Si està reproduint, reiniciem la reproducció
    if (isPlaying) {
        resetAutoPlay()
    }
    // Iniciem la reproducció amb filtres
    startAutoplay(options);
}






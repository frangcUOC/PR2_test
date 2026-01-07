/**
 * @file src/chart/autoplay.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Gestió de les reproduccions del gràfic
 *
 * Funcions principals:
 * - Iniciar i aturar l’autoplay
 * - Avançar els anys
 * - Actualitzar el gràfic i els sliders durant la reproducció
 * - Modificar la icona de Play/Pause.
 */


/**
 * Inicia la reproducció automàtica.
 * Avança els anys dins del rang definit i actualitza el gràfic.
 */
function startAutoplay(options = null) {

    // Establim el primer i darrer any. Declarem la variable del llindar de mortalitat
    let firstYearData = currentYear;
    let lastYearData = d3.max(original_data, d => d.TIME_PERIOD);

    // Variable per a la gestió de l'any
    let year = null;

    // Netejem interval
    if (autoPlayInterval != null) {
        clearInterval(autoPlayInterval);
    }

    // Posem a true perquè s'està reproduint
    isPlaying = true;

    // Actualitzem la icona
    setPauseIcon();
    // En cas que utilitzem un filtre predefinit pel gràfic
    if(options!= null){
        firstYearData = options[5];
        lastYearData = options[6];
    }

    // Assignem el primer any
    year = firstYearData;

    // Obtenim el valor d el'any del slider
    document.getElementById("yearSlider").value = year;

    // Actualitzem la variable global de l'any, apliquem filtres i actualitzem l'slider del pib i el gràfic.
    currentYear = year;
    applyFilter();
    updateChart();
    setPibSlider();

    // Cicle de reproducció, canvi d'icona, actualitzar filtres, slider del PIB i gràfic.
    autoPlayInterval = setInterval(() => {
        year += 1;
        if (year > lastYearData) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            isPlaying = false;
            setPlayIcon();
            return;
        }
        document.getElementById("yearSlider").value = year;
        currentYear = year;
        applyFilter();
        updateChart();
        setPibSlider();

    }, 1000);
}

/**
 * Atura la reproducció automàtica.
 * Si el mode és "play", fa el reinici.
 *
 * @param {string} mode - "pause" per aturar, "play" per reiniciar.
 */

function resetAutoPlay(mode = "play") {

    // Establim l'any inicial per reiniciar reproducció
    if(mode === "play"){
        currentYear = d3.min(original_data, d => d.TIME_PERIOD);
    } else {
        // Pausa, deixem la icona de play preparada
        setPlayIcon()
    }
    // Actualitzem paràmetres de la reproducció
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isPlaying = false;
}

/**
 * Gestiona la icona de play.
 */
function setPlayIcon() {

    // S'actualitza la icona
    document.getElementById("playPauseIcon").innerHTML = `
        <polygon points="5,3 19,12 5,21"/>`;
}

/**
 * Gestiona la icona de pausa.
 */
function setPauseIcon() {

    // S'actualitza la icona
    document.getElementById("playPauseIcon").innerHTML = `
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>`;
}


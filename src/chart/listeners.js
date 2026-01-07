/**
 * @file src/chart/listener.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Gestiona els listeners dels botons de la reproducció i filtres predefinits
 *
 * Funcions principals:
 * - Gestionar els botons interactius de la reproducció i filtres predefinits.
 */

/**
 * Gestiona la reproducció i actualitza el gràfic.
 */

document.getElementById("playButton").addEventListener("click", () => {
    if (isPlaying) {
        // Pausa
        resetAutoPlay("pause")
    } else {
        // Reproducció inicial si s'ha arribat al final
        if (currentYear >= d3.max(original_data, d => d.TIME_PERIOD)) {

            // Reiniciem l'any
            currentYear = d3.min(original_data, d => d.TIME_PERIOD)
            // Actualitzem gràfic
            updateChart();
        }
        // S'inicia la reproducció automàtica
        startAutoplay();
    }
});
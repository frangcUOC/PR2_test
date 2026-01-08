/**
 * @file src/main.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description
 * Gestiona els nivells del slider d'històries per enviar les dades al gràfic de punts. Això actualitzarà el gràfic i
 * el div que contindrà la descripció de la història.
 * Funcions principals executades:
 * - Gestiona els esdeveniments de l'slider d'històries
 * - Actualitza el gràfic i el div de les històries.
 */

// Variables globals per la interacció amb l'slider de les narratives
let maxActivated = 0;
const iframePOLL = document.getElementById("iframeObjectPOLL");
const iframePIB  = document.getElementById("iframeObjectPIB");
const pollSectionScroll = document.getElementById("poll-section-scroll");
const pibSectionScroll = document.getElementById("pib-section-scroll")


/**
 * Slider de contaminants i iframes
 */
document.getElementById("storySliderPOLL").addEventListener("input", checkSlider);
document.getElementById("storySliderPIB").addEventListener("input", checkSlider);

/**
 * Recull els nivells de l'slider, activa les caixes i actualitza el gràfic i el text de la història
 */
function checkSlider() {

    const level = this.value;
    let chartTitlePOLL = document.getElementById("titleChartPOLL");
    let chartTitlePIB = document.getElementById("titleChartPIB");
    let box = null;
    let currentSlider = null;

    // Actualitzem el gràfic i definim l'slider actual
    currentSlider = this;
    if(currentSlider.id === "storySliderPOLL"){
        iframePOLL.contentWindow.postMessage(
            {level: level},
            "*"
        );
        chartTitlePOLL.textContent = document.getElementById(`level${level}`).textContent;
    } else {
        iframePIB.contentWindow.postMessage(
            {level: level},
            "*"
        );
        chartTitlePIB.textContent = document.getElementById(`level${level}`).textContent;
    }


    // Activem la caixa si baixem i desactivem l'anterior
    if (level > maxActivated) {
        // Desactivem el parpalleig
        currentSlider.classList.remove("slider-blink");
        maxActivated = level;
    }

    // Per seleccionar cada slider amb el seu gràfic.
    box = document.querySelector(`.story-box[data-level="${level}"]`);
    if (box) {
        box.classList.remove("inactive");
        box.classList.add("active");
    }

}

/**
 * Fa que l'slider de les stories parpellegi per cridar l'atenció a l'usuari. S'executa
 * en carregar la pàgina.
 */

history.scrollRestoration = "manual";
document.addEventListener("DOMContentLoaded", function () {
    // Situem la pàgina al principi de tot
    window.scrollTo(0, 0);

    // Activem el parpelleig en carregar
    document.getElementById("storySliderPOLL").classList.add("slider-blink");
    document.getElementById("storySliderPIB").classList.add("slider-blink");
});

window.addEventListener("load", () => {
    iframePOLL.contentWindow.postMessage({ level: 0 }, "*");
    iframePIB.contentWindow.postMessage({ level: 5 }, "*");
});


/**
 * Fa que les seccions de la narrativa apareguin a mesura que es fa scroll.
 */
const elements = document.querySelectorAll('.scrollAnimation');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.5   // quan el 20% de l’element és visible
});

elements.forEach(el => observer.observe(el));


/**
 * Gestiona l'aparició seqüencial de les conclusions
 */
const conclusionsSection = document.querySelector(".conclusions-page");
const conclusions = document.querySelectorAll(".conclusions-inactive");

const conclusionsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            conclusions.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add("conclusions-active");
                }, index * 1200); // 1.2s entre cada conclusió
            });

            conclusionsObserver.disconnect(); // només un cop
        }
    });
}, { threshold: 0.3 });

if (conclusionsSection) {
    conclusionsObserver.observe(conclusionsSection);
}


/**
 * Carrega els gràfics quan l'usuari arriba a la secció corresponent
 */

// Quan s'arriba a la secció de contaminants
const pollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            iframePOLL.contentWindow.postMessage({ level: 0 }, "*");
            pollObserver.disconnect(); // només un cop
        }
    });
}, { threshold: 0.4 });

// Quan s'arriba a la secció del PIB
const pibObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            iframePIB.contentWindow.postMessage({ level: 5 }, "*");
            pibObserver.disconnect(); // només un cop
        }
    });
}, { threshold: 0.4 });

if (pollSectionScroll) {
    pollObserver.observe(pollSectionScroll);
}

if (pibSectionScroll) {
    pibObserver.observe(pibSectionScroll);
}










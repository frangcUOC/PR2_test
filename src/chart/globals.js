/**
 * @file src/chart/globals.js
 * @author Francisco Garcia Caparros
 * @version 1
 * @description Variables i constants globals per a tota l'aplicació
 *
 * Funcions principals:
 * - Variables d'estils, formats del gràfic i d'altres que fan servir els altres mètodes.
 */

// Variables globals

// Paràmetres bàsic relacionats amb la configuration regional
const localeES = d3.formatLocale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", " €"]
});
const formatMiles = localeES.format(",.2f");
const formatMilesNoDec = localeES.format(",.0f");
const formatEuro = localeES.format("$,.0f");
const formatSmart = localeES.format("~g");

// Paràmetres relacionats amb el disseny del gràfic
let innerWidth = null;
let innerHeight = null;
let svg = null;
let chart = null;
let pibColorScale = null;
let color1 = "#9eadd1";
let color2 = "#06194e";
let tooltip = null;
const bodyBackgroundColor = "transparent";

// Pels diferents mètodes i càrrega de dades
let main_dataset = "data/final_data_wide_env.csv";
let data = [];
let currentYear = null;
let currentMode = "emissions";
let visibleData = [];
let currentPIBThreshold = null;
let currentPollutant = null
let autoPlayInterval = null;
let firstRender = true;
let isPlaying = false;
let original_data = null;
let pibSliderSelected = false;
let pollutantList = null;
let specialFields = {};
let diseaseList = null;
let currentMaxMortality = null;
let globalPIBMin = null;
let globalPIBMax = null;
let globalPollMin = null;
let globalPollMax = null;
let currentDisease = null;
let pibSliderSteps = 6;
let agg_deaths_total = 0;
let agg_deaths_mean = 0;
let filtDict = {
    sex: "",
    age: "",
    Disease_type: ""
};
let mortalityThreshold = 0;
let storyMode = false;
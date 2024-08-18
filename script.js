// Functie om profielgegevens op te slaan in localStorage
function saveProfile() {
    const profile = {
        username: document.getElementById('username').value,
        birthdate: document.getElementById('birthdate').value,
        age: document.getElementById('age').value,
        height: parseFloat(document.getElementById('height').value),
        goalWeight: parseFloat(document.getElementById('goalWeight').value),
        timeFrame: parseInt(document.getElementById('timeFrame').value),
        timeUnit: document.getElementById('timeUnit').value
    };

    localStorage.setItem('profile', JSON.stringify(profile));
    calculateWeightLossGoal();
    alert('Profiel opgeslagen!');
}

// Functie om profielgegevens te laden bij het opstarten van de pagina
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
        document.getElementById('username').value = profile.username;
        document.getElementById('birthdate').value = profile.birthdate;
        document.getElementById('age').value = profile.age;
        document.getElementById('height').value = profile.height;
        document.getElementById('goalWeight').value = profile.goalWeight;
        document.getElementById('timeFrame').value = profile.timeFrame;
        document.getElementById('timeUnit').value = profile.timeUnit;
        calculateWeightLossGoal();
    }
}

// Functie om het benodigde gewichtsverlies per week of maand te berekenen
function calculateWeightLossGoal() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    if (profile && weightData.length > 0) {
        const currentWeight = weightData[weightData.length - 1].weight;
        const goalWeight = profile.goalWeight;
        const weightToLose = currentWeight - goalWeight;

        let period = profile.timeFrame;
        let periodText = profile.timeUnit === 'weeks' ? 'weken' : 'maanden';
        let weightPerPeriod = (weightToLose / period).toFixed(2);

        document.getElementById('weightGoalInfo').innerHTML = `
            <p><strong>Beschrijving:</strong> De volgende berekening laat zien hoeveel kilo je per ${periodText} moet afvallen om je doelgewicht te bereiken binnen een periode van ${period} ${periodText}. Deze periode is gebaseerd op je invoer en kan worden aangepast aan je persoonlijke voorkeuren.</p>
            <p>Om je doel te bereiken, moet je gemiddeld <strong>${weightPerPeriod} kg per ${periodText}</strong> afvallen.</p>
        `;
    }
}

// Functie om een samenvatting van je fitheid te genereren
function generateFitnessSummary() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const airborneData = JSON.parse(localStorage.getItem('airborneData')) || [];
    const bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];

    let summary = "<h3>Fitheidssamenvatting:</h3>";

    if (profile) {
        summary += `<p>Gebruikersnaam: ${profile.username}</p>`;
        summary += `<p>Leeftijd: ${profile.age}</p>`;
        summary += `<p>Lengte: ${profile.height} cm</p>`;
        summary += `<p>Gewichtsdoel: ${profile.goalWeight} kg</p>`;
    } else {
        summary += "<p>Profielgegevens zijn niet beschikbaar.</p>";
    }

    if (weightData.length > 0) {
        const latestWeight = weightData[weightData.length - 1].weight;
        summary += `<p>Huidig gewicht: ${latestWeight} kg</p>`;
        const weightDiff = (latestWeight - profile.goalWeight).toFixed(2);
        if (weightDiff > 0) {
            summary += `<p>Je moet nog ${weightDiff} kg afvallen om je doel te bereiken.</p>`;
        } else if (weightDiff < 0) {
            summary += `<p>Gefeliciteerd! Je hebt je doel bereikt en bent ${Math.abs(weightDiff)} kg onder je doelgewicht.</p>`;
        } else {
            summary += "<p>Gefeliciteerd! Je hebt precies je gewichtsdoel bereikt.</p>";
        }
    } else {
        summary += "<p>Geen gewichtsgegevens beschikbaar.</p>";
    }

    if (cooperData.length > 0) {
        const latestCooperTest = cooperData[cooperData.length - 1];
        summary += `<p>Laatste Coopertest - Afstand: ${latestCooperTest.distance} meters (op ${formatDate(latestCooperTest.cooperDate)})</p>`;
    } else {
        summary += "<p>Geen Coopertestgegevens beschikbaar.</p>";
    }

    if (airborneData.length > 0) {
        const latestAirborneWod = airborneData[airborneData.length - 1];
        summary += `<p>Laatste Airborne WOD - Voltooide Ronden: ${latestAirborneWod.roundsCompleted} (op ${formatDate(latestAirborneWod.airborneDate)})</p>`;
    } else {
        summary += "<p>Geen Airborne WOD gegevens beschikbaar.</p>";
    }

    if (bloodPressureData.length > 0) {
        const latestBP = bloodPressureData[bloodPressureData.length - 1];
        summary += `<p>Laatste Bloeddruk - Systolisch: ${latestBP.systolic} mm Hg, Diastolisch: ${latestBP.diastolic} mm Hg (op ${formatDate(latestBP.bpDate)})</p>`;
    } else {
        summary += "<p>Geen bloeddrukgegevens beschikbaar.</p>";
    }

    document.getElementById('fitnessSummary').innerHTML = summary;
}

// Functie om gewicht toe te voegen en op te slaan in localStorage
function addWeight() {
    const weightDate = document.getElementById('weightDate').value;
    const newWeight = parseFloat(document.getElementById('newWeight').value);

    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const existingEntry = weightData.find(entry => entry.date === weightDate);

    if (existingEntry) {
        existingEntry.weight = newWeight;
    } else {
        weightData.push({ date: weightDate, weight: newWeight });
    }

    localStorage.setItem('weightData', JSON.stringify(weightData));
    displayWeightLog();
    calculateWeightLossGoal();
    alert('Gewicht toegevoegd!');
}

// Functie om het gewichtslogboek weer te geven
function displayWeightLog() {
    const weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const weightLog = document.getElementById('weightLog');
    weightLog.innerHTML = '';

    weightData.forEach(entry => {
        const formattedDate = formatDate(entry.date);
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${formattedDate}:</strong> 
            <input type="number" value="${entry.weight}" onchange="updateWeight('${entry.date}', this.value)" /> kg
            <button onclick="deleteWeight('${entry.date}')">Verwijderen</button>
        `;
        weightLog.appendChild(div);
    });
}

// Functie om een gewicht te verwijderen uit het logboek
function deleteWeight(date) {
    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    weightData = weightData.filter(entry => entry.date !== date);

    localStorage.setItem('weightData', JSON.stringify(weightData));
    displayWeightLog();
    calculateWeightLossGoal();
}

// Functie om gewicht bij te werken voor een specifieke datum
function updateWeight(date, newWeight) {
    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    const entryIndex = weightData.findIndex(entry => entry.date === date);

    if (entryIndex !== -1) {
        weightData[entryIndex].weight = parseFloat(newWeight);
        localStorage.setItem('weightData', JSON.stringify(weightData));
        displayWeightLog();
        calculateWeightLossGoal();
        alert('Gewicht bijgewerkt!');
    }
}

// Functie om bloeddrukresultaten toe te voegen en op te slaan in localStorage
function addBloodPressure() {
    const bpDate = document.getElementById('bpDate').value;
    const systolic = parseInt(document.getElementById('systolic').value, 10);
    const diastolic = parseInt(document.getElementById('diastolic').value, 10);

    let bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];
    bloodPressureData.push({ bpDate, systolic, diastolic });

    localStorage.setItem('bloodPressureData', JSON.stringify(bloodPressureData));
    displayBloodPressureLog();
    alert('Bloeddrukwaarde toegevoegd!');
}

// Functie om een bloeddrukresultaat te verwijderen uit het logboek
function deleteBloodPressure(date) {
    let bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];
    bloodPressureData = bloodPressureData.filter(entry => entry.bpDate !== date);

    localStorage.setItem('bloodPressureData', JSON.stringify(bloodPressureData));
    displayBloodPressureLog();
}

// Bloeddruklogboek weergeven
function displayBloodPressureLog() {
    const bloodPressureData = JSON.parse(localStorage.getItem('bloodPressureData')) || [];
    const bloodPressureLog = document.getElementById('bloodPressureLog');
    bloodPressureLog.innerHTML = '';

    bloodPressureData.forEach(entry => {
        const formattedDate = formatDate(entry.bpDate);
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${formattedDate}:</strong> 
            Systolisch: ${entry.systolic} mm Hg, Diastolisch: ${entry.diastolic} mm Hg
            <button onclick="deleteBloodPressure('${entry.bpDate}')">Verwijderen</button>
        `;
        bloodPressureLog.appendChild(div);
    });
}

// Functie om Coopertest resultaten toe te voegen en op te slaan in localStorage
function addCooperTest() {
    const cooperDate = document.getElementById('cooperDate').value;
    const distance = parseInt(document.getElementById('distance').value, 10);

    let cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    cooperData.push({ cooperDate, distance });

    localStorage.setItem('cooperData', JSON.stringify(cooperData));
    displayCooperLog();
    alert('Coopertest resultaat toegevoegd!');
}

// Functie om een Coopertest resultaat te verwijderen uit het logboek
function deleteCooperTest(date) {
    let cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    cooperData = cooperData.filter(entry => entry.cooperDate !== date);

    localStorage.setItem('cooperData', JSON.stringify(cooperData));
    displayCooperLog();
}

// Coopertest logboek weergeven
function displayCooperLog() {
    const cooperData = JSON.parse(localStorage.getItem('cooperData')) || [];
    const cooperLog = document.getElementById('cooperLog');
    cooperLog.innerHTML = '';

    cooperData.forEach(entry => {
        const formattedDate = formatDate(entry.cooperDate);
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${formattedDate}:</strong> 
            Afstand: ${entry.distance} meters
            <button onclick="deleteCooperTest('${entry.cooperDate}')">Verwijderen</button>
        `;
        cooperLog.appendChild(div);
    });
}

// Functie om Airborne WOD resultaten toe te voegen en op te slaan in localStorage
function addAirborneWod() {
    const airborneDate = document.getElementById('airborneDate').value;
    const roundsCompleted = parseFloat(document.getElementById('roundsCompleted').value);

    let airborneData = JSON.parse(localStorage.getItem('airborneData')) || [];
    airborneData.push({ airborneDate, roundsCompleted });

    localStorage.setItem('airborneData', JSON.stringify(airborneData));
    displayAirborneLog();
    alert('Airborne Benchmark WOD resultaat toegevoegd!');
}

// Functie om een Airborne WOD resultaat te verwijderen uit het logboek
function deleteAirborneWod(date) {
    let airborneData = JSON.parse(localStorage.getItem('airborneData')) || [];
    airborneData = airborneData.filter(entry => entry.airborneDate !== date);

    localStorage.setItem('airborneData', JSON.stringify(airborneData));
    displayAirborneLog();
}

// Airborne WOD logboek weergeven
function displayAirborneLog() {
    const airborneData = JSON.parse(localStorage.getItem('airborneData')) || [];
    const airborneLog = document.getElementById('airborneLog');
    airborneLog.innerHTML = '';

    airborneData.forEach(entry => {
        const formattedDate = formatDate(entry.airborneDate);
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${formattedDate}:</strong> 
            Voltooide Ronden: ${entry.roundsCompleted.toFixed(1)}
            <button onclick="deleteAirborneWod('${entry.airborneDate}')">Verwijderen</button>
        `;
        airborneLog.appendChild(div);
    });
}

// Functie om de datum om te zetten naar DD-MM-YYYY formaat
function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

// Bij het laden van de pagina, toon alle opgeslagen gegevens
window.onload = function() {
    loadProfile();
    displayWeightLog();
    displayBloodPressureLog();
    displayCooperLog();
    displayAirborneLog();
};



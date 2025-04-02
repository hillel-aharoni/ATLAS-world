// script.js
import { getAllCountries, getCountryData } from './api.js';

let map = null;


async function loadAllCountries() {
    const countriesGrid = document.getElementById('countries-grid');
    countriesGrid.innerHTML = '<div class="loader"></div>';

    try {
        const countries = await getAllCountries();
        countriesGrid.innerHTML = '';

        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.innerHTML = `
                <img src="${country.flags.png}" alt="דגל ${country.name.common}">
                <div class="country-info">
                    <h3>${country.name.common}</h3>
                    <button class="view-button" data-country="${country.name.common}">הצג פרטים</button>
                </div>
            `;
            countriesGrid.appendChild(card);
        });

        // הוספת מאזיני לחיצה לכפתורים
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', () => showCountryDetails(button.dataset.country));
        });

    } catch (error) {
        countriesGrid.innerHTML = '<div class="error">שגיאה בטעינת המדינות</div>';
        console.error('Error loading countries:', error);
    }
}

async function showCountryDetails(countryName) {
    const countryPage = document.getElementById('country-page');
    const countryDetails = document.getElementById('countryDetails');

    try {
        const country = await getCountryData(countryName);

        // הצגת דף הפרטים
        countryPage.classList.remove('hidden');

        // עדכון תוכן
        countryDetails.querySelector('.country-header').innerHTML = `
            <img src="${country.flags.png}" alt="דגל ${country.name.common}">
            <h2>${country.name.common}</h2>
            <iframe 
               width="100%" 
                 height="400px"
                  frameborder="0"
                  src="https://maps.google.com/maps?q=${country.name.common}&output=embed">
            </iframe>
        `;

        // יצירת כפתורים למפות
        const mapButtons = countryDetails.querySelector('.map-buttons');
        mapButtons.innerHTML = '';

        if (country.maps) {
            if (country.maps.googleMaps) {
                const googleButton = createMapButton('Google Maps', country.maps.googleMaps);
                mapButtons.appendChild(googleButton);
            }

            if (country.maps.openStreetMaps) {
                const osmButton = createMapButton('OpenStreetMap', country.maps.openStreetMaps);
                mapButtons.appendChild(osmButton);
            }
        }

        // עדכון תוכן
        countryDetails.querySelector('.country-data').innerHTML = `
            <p><strong>אוכלוסייה:</strong> ${new Intl.NumberFormat('he-IL').format(country.population)}</p>
            <p><strong>בירה:</strong> ${country.capital ? country.capital[0] : 'לא ידוע'}</p>
            <p><strong>שפות:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'לא ידוע'}</p>
        `;

    } catch (error) {
        countryDetails.innerHTML = '<div class="error">שגיאה בטעינת פרטי המדינה</div>';
        console.error('Error loading country details:', error);
    }
}

function createMapButton(text, url) {
    const button = document.createElement('a');
    button.href = url;
    button.target = '_blank';
    button.className = 'map-button';
    button.textContent = text;
    return button;
}

// מאזין לחיצה לכפתור חזרה
document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('country-page').classList.add('hidden');
});

// מאזין לחיפוש
document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('נא להזין שם מדינה');
        return;
    }

    try {
        const countriesGrid = document.getElementById('countries-grid');
        countriesGrid.innerHTML = '<div class="loader"></div>';

        const countries = await getAllCountries();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filteredCountries.length === 0) {
            countriesGrid.innerHTML = '<div class="error">לא נמצאו תוצאות</div>';
            return;
        }

        countriesGrid.innerHTML = '';
        filteredCountries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.innerHTML = `
                <img src="${country.flags.png}" alt="דגל ${country.name.common}">
                <div class="country-info">
                    <h3>${country.name.common}</h3>
                    <button class="view-button" data-country="${country.name.common}">הצג פרטים</button>
              
                </div>
            `;
            countriesGrid.appendChild(card);
        });

        // הוספת מאזיני לחיצה לכפתורים
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', () => showCountryDetails(button.dataset.country));
        });

    } catch (error) {
        alert('שגיאה בחיפוש המדינה');
        console.error('Error searching countries:', error);
    }
}

// טעינת כל המדינות בטעינת הדף
loadAllCountries();
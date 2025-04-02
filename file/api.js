// modules/api.js
export let allData;

export async function getAllCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
    if (!response.ok) {
        throw new Error('שגיאה בטעינת המדינות');
    }
    const data = await response.json();
    allData = data;
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export async function getCountryData(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true&fields=name,flags,maps,population,capital,languages`);
    if (!response.ok) {
        throw new Error('שגיאה בטעינת פרטי המדינה');
    }
    const data = await response.json();
    return data[0];
}

export async function getCountryByCode(countryCode) {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,flags,maps,population,capital,languages`);
    if (!response.ok) {
        throw new Error('קוד מדינה לא ידוע');
    }
    const data = await response.json();
    return data[0];
}
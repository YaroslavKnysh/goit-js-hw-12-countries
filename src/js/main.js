import fetchCountries from './fetchCountries.js';
import cardCountryTpl from '../templates/cardCountry.hbs';
import debounce from 'lodash.debounce';

const input = document.querySelector('.input_form');
const listCountries = document.querySelector('.country_list');
const countryCard = document.querySelector('.country_card');

const findCountryFn = e => {
  localStorage.setItem('countryEnter', e.target.value);
  countryCard.innerHTML = '';
  listCountries.innerHTML = '';
  if (e.target.value === '') {
    return;
  }
  fetchCountries(e.target.value)
    .then(response => response.json())
    .then(countries => {
      console.log(countries);

      switch (true) {
        case countries.length > 10:
          break;
        case countries.length > 1:
          listCountries.innerHTML = countries
            .map(({ name }) => `<li>${name.common}</li>`)
            .join('');
          break;
        case countries.length > 0:
          countryCard.innerHTML = cardCountryTpl(countries[0]);
          break;
      }
    });
};

input.addEventListener('input', debounce(findCountryFn, 500));

let localStorageSave = localStorage.getItem('countryEnter');
if (localStorageSave !== undefined) {
  findCountryFn({ target: { value: localStorageSave } });
  input.value = localStorageSave;
}

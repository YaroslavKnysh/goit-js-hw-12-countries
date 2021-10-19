import fetchCountries from './fetchCountries.js';
import cardCountryTpl from '../templates/cardCountry.hbs';
import debounce from 'lodash.debounce';
import { alert, notice, info, success, error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

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
          const myStack = new Stack({
            delay: 1000,
            dir1: 'down',
            dir2: 'left',
            mode: 'light',
            firstpost1: 25,
            firstpost2: 25,
            spacing1: 36,
            spacing2: 36,
            push: 'top',
            context: document.body,
            positioned: true,
            maxStrategy: 'close',
          });
          alert({
            title: 'Oh, no!',
            text: 'Too many matches found. Please enter a more specific query!',
            type: 'error',
            stack: myStack,
            addClass: 'alert',
          });
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

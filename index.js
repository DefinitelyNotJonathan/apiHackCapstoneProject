//TEST VERSION WITH DIFFERENT WEATHER API

/*Line 40 is the only line I am playing with/uncertain of. Looking at whether or
 not I need [i] for Timeframes.*/

'use strict';

//fetch and api variables

const apiNPS = 'IfcsBFYkZPOU1J024K3TaNhMYXtHZ7bCHqZhtxrP';
const urlNPS = 'https://developer.nps.gov/api/v1/campgrounds';
const apiWthr = 'bef3fc1d798647285a40a276507cf08a';
const urlWthr = ' http://api.weatherunlocked.com/api/forecast/us.';
const idWthr = '133c3d86';


//function to format query format query parameters

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//function to render both parkObj and weatherObj

function displayResults(parkObj, weatherObj) {
  console.log(parkObj)
  console.log(weatherObj)
  $('#results-list').empty();
  for (let i=0; i <parkObj.data.length; i++){
    $('#results-list').append(
      `<li><h3>${parkObj.data[i].name}</h3>
      <p>State: ${parkObj.data[i].addresses.stateCode}
      <p>Designation: ${parkObj.data[i].accessibility.classifications}</p>
      <p>Description: ${parkObj.data[i].description}</p>
      <p>Weather Info: ${parkObj.data[i].weatherOverview}</p>
      <p>Forecast: ${weatherObj.Days[i].Timeframes[i].date}</p>
      <p>${weatherObj.Days[i].Timeframes[i].wx_desc}</p>
      <p>Directions: ${parkObj.data[i].directionsUrl}</p>
      <p>Website: ${parkObj.data[i].reservationsUrl}</p>
      </li>`
    )};
  $('#results').removeClass('hidden');
}

//function to set api 1 params and send GET request

function getNPSResults(query) {
  const params = {
    stateCode: query,
    limit: 5,
    fields: "addresses",
    api_key: apiNPS
  };
  const queryString1 = formatQueryParams(params)
  const url1 = urlNPS + '?' + queryString1;
  console.log(url1);
  fetch(url1)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function(parkObj) {
      for (let i=0; i<parkObj.data.length; i++) {
        getWeatherResults(parkObj.data[i].addresses[0].postalCode);
      }
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

  //function to set api 2 params and send GET request

function getWeatherResults(parkObj) {
  const zip= parkObj;
  const params= {
    app_id:idWthr,
    api_key:apiWthr
  };
  const queryString2= formatQueryParams(params)
  const url2= urlWthr + zip + '?' + queryString2;
  console.log(url2);
  fetch(url2)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then (weatherObj => {displayResults (parkObj, weatherObj);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

//form watcher

$(function(){
  $('#js-form').submit(function(e) {
    e.preventDefault();
    getNPSResults($('#js-search-term').val());
  });
})

/*problem: lat and lng values are frequently not populated from NPS API. Could
use address to then run through Google Maps Geocoding and then extract the lat
and lng*/

/*To Do:
Establish pages navigation feature
Expand result information displayed
*/

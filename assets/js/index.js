const temp = document.querySelector('.hero__forcast__temp')
const cityName = document.querySelector('.hero__forcast__location')
const time = document.querySelector('.hero__date__time')
const day = document.querySelector('.hero__date__day')
const humidity = document.querySelector('#forcast__info__humidity')
const searchInput = document.querySelector('#search-bar')
const suggestions = document.querySelector('#suggestions');
const sunrise = document.querySelector('#forcast__info__sunrise')
const sunset = document.querySelector('#forcast__info__sunset')



const APIKey = '13cc3797c0c20008e4e56c1f17fc2984'
const weatherBaseEndpoint =`https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${APIKey}`
const cityBaseEndpoint = 'https://api.teleport.org/api/cities/?search=';



let getWeatherByCityName = async (citystring) =>{
  let city;
  if(citystring.includes(',')) {
    city = citystring.substring(0, citystring.indexOf(',')) + citystring.substring(citystring.lastIndexOf(','));
    console.log(city)
  } else {
    city = citystring;
  }
  let endpoint = weatherBaseEndpoint + '&q=' + city;
  let response = await fetch(endpoint);
  if(response.status !== 200) {
    alert('City Not Found!');
    return;
  }
  let weather = await response.json();
  return weather;
}


let weatherForCity = async (city) => {
  let weather = await getWeatherByCityName(city);
    if(!weather) {
      return;
    }
    updateCurrentWeather(weather);
}

const timeConverter = (seconds, timezone) => {
  let localSeconds = seconds + timezone
  let miliSeconds = localSeconds * 1000
  let dateObj = new Date(miliSeconds)
  let twentyFourHourTime = dateObj.toISOString().substring(16, 11)
  let hour = parseInt(twentyFourHourTime.substring(0,2))
  let twelveHourTime = hour > 12 ? (hour - 12).toString() + twentyFourHourTime.substring(2) + 'pm' : hour.toString() + twentyFourHourTime.substring(2) + 'am'
  return twelveHourTime
}

const updateCurrentWeather = (data) => {
  temp.textContent = `${Math.floor(data.main.temp)}°`
  cityName.textContent = `${data.name}, ${data.sys.country}`
  day.textContent = dayOfWeek()
  time.textContent = timeConverter(data.dt, data.timezone)
  humidity.textContent = `${data.main.humidity}%`
  sunrise.textContent = timeConverter(data.sys.sunrise, data.timezone)
  sunset.textContent = timeConverter(data.sys.sunset, data.timezone)
}

const init = () => {
  weatherForCity('Tehran')
}

init()


let dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'});
}

searchInput.addEventListener('keydown', async (e) => {
  if(e.keyCode === 13){
    weatherForCity(searchInput.value);
  }
})

searchInput.addEventListener('input', async () => {
  let endpoint = cityBaseEndpoint + searchInput.value;
  let result = await (await fetch(endpoint)).json();
  suggestions.innerHTML = '';
  let cities = result._embedded['city:search-results'];
  let length = cities.length > 5 ? 5 :cities.length;
  for(let i =0; i<length; i++) {
    let option = document.createElement('option');
    option.value = cities[i].matching_full_name;
    suggestions.appendChild(option);
  }
})
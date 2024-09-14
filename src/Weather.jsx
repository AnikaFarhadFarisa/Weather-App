import React, {useState} from 'react';
import { DateTime } from 'luxon';
import humid from './assets/droplet-128.png';
import pressure from './assets/icons8-air-pressure-100.png';
import feels from './assets/temperature-2-128.png';
import visibility from './assets/icons8-eye-96.png';
import wind from './assets/icons8-wind-100.png';

function Weather(){

  const [inputCity, setInputCity] = useState('');
  const [weather, setWeather] = useState('');
  const [hourlyWeather, setHourlyWeather] = useState('');
  const [dailyWeather, setDailyWeather] = useState('');
  const APIKEY = "b65572ed728aa87a64d0322b95c79cb6";
  const CITY = inputCity;

  const handleInputChange = (event) => {
    setInputCity(event.target.value);
  };

  const handleButtonClick = () => {
    if(!inputCity){
      alert('Please enter a city.');
      return;
    }

    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${APIKEY}`;
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${APIKEY}`;

    fetch(currentWeather).then(response => response.json())
                         .then(data => {
                            console.log(data);
                            if(data.cod === '404'){
                              alert('Error fetching data. Please try again with a valid city name.');
                              setWeather('');
                              setHourlyWeather('');
                              setInputCity('');
                              setDailyWeather('');
                              return;
                            }
                            setWeather(data);
                         })
                         .catch(error => {
                            alert('Error fetching current weather data. Please try again.');
                            console.error('Error fetching current weather data:', error);
                         });
    fetch(forecast).then(response => response.json())
                      .then(data => {
                        //console.log(data);
                        dailyForecast(data.list);
                        setHourlyWeather(data.list.slice(0,8));
                      })
                      .catch(error => {
                        console.error('Error fetching hourly forecast data:', error);
                        alert('Error fetching hourly forecast data. Please try again.');
                      });
    setInputCity('');  
  };

  function dailyForecast(itemList){
    let forecastList = [itemList[8], itemList[16],
                         itemList[24], itemList[32]];
    setDailyWeather(forecastList);
  }

  function showDate(tZone, dTime){
    const outpt = DateTime.fromSeconds(dTime + tZone, {zone: "utc"}).toFormat("dd LLLL");
    return `${outpt}`;
  }

  function showTime(tZone, dTime){
    const time = DateTime.fromSeconds(dTime + tZone, {zone: "utc"}).toFormat("hh:mm a");
    return `${time}`
  }

  function showDay(tZone, dTime){
    const outpt = DateTime.fromSeconds(dTime + tZone, {zone: "utc"}).toFormat("dd'/'LL  ccc");
    return `${outpt}`;
  }
  
  return (
    <div>
        <div className="search">
            <input
            type="text"
            value={inputCity}
            onChange={handleInputChange}
            placeholder="Enter city name"
            />
            <button onClick={handleButtonClick}>Search</button>
        </div>

        <div className="outer-box">
          <div className="card">
            {weather ? (
              <div className="leftDiv">
                <h1 id="city-name">{weather.name}</h1>
                <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
                alt= "Weather icon"
                height={70}/>
                <h2 id="date">{showDate(weather.timezone, weather.dt)}</h2>
                <h2 id="time">{showTime(weather.timezone, weather.dt)}</h2>
              </div>
            ) : (
            <></>
            )}

            {weather ? (
              <div className="rightDiv">
                <h1 id="temp">{Math.round(weather.main.temp - 273.15)}°C</h1>
                <h3>{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</h3> 
                <p>Min-Temp: {Math.round(weather.main.temp_min - 273.15)}°C</p>
                <p>Max-Temp: {Math.round(weather.main.temp_max - 273.15)}°C</p>
              </div>
            ) : (
            <></>
            )}

          </div>
        </div>

        <div className="outer-details">
          
            {weather ? (
            <div className="details">
              <div className="detail">
                <img src={humid} 
                alt="Humidity icon"
                height={30} />
                <h3 id="info">Humidity: </h3>
                <h3>{weather.main.humidity} %</h3>
              </div>
            
              <div className="detail">
                <img src={pressure} 
                alt="Air pressure icon"
                height={30} />
                <h3 id="info">Air pressure: </h3>
                <h3>{weather.main.pressure} hPa</h3>
              </div>

              <div className="detail">
                <img src={feels} 
                alt="Temperature feels like icon"
                height={30} />
                <h3 id="info">Feels like: </h3>
                <h3>{Math.round(weather.main.feels_like - 273.15)}°C</h3>
              </div>

              <div className="detail">
                <img src={visibility} 
                alt="Visibility icon"
                height={30} />
                <h3 id="info">Visibility: </h3>
                <h3>{weather.visibility} m</h3>
              </div>

              <div className="detail">
                <img src={wind} 
                alt="Wind icon"
                height={30} />
                <h3 id="info">Wind: </h3>
                <h3>{weather.wind.speed} m/s</h3>
              </div>
            </div>
            ):(<></>)
            }
          </div>

        <div className="outerBox">
          {hourlyWeather ? (
            <div className="hourly-outer">
              {hourlyWeather ? (
              hourlyWeather.map((item, index) => (
              <div className="hourly-forecast" key={index}>
                <p>{showTime(weather.timezone, item.dt)}</p>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
                <p>{Math.round(item.main.temp - 273.15)}°C</p>
              </div>
              ))
            ):(<></>)}   
            </div>
           ):(<></>)
          }
        </div>

        <div className="daily-outer">
          {dailyWeather ? (
            <div className="bottomp">
              {dailyWeather ? (
              dailyWeather.map((item,index) => (
              <div className="daily-forecast">
                <div className="left-side" key={index}>
                  <p>{showDay(weather.timezone, item.dt)} {(showTime(weather.timezone, item.dt))}</p>
                </div>
                <div className="middle-side">
                  <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
                </div>
                <div className="right-side">
                  <p>{Math.round(item.main.temp - 273.15)}°C</p>
                </div>
              </div>
              ))
              ):(<></>)
              }   
            </div>
            ):(<></>)
          }
        </div>
    </div> 
  );
};    
export default Weather
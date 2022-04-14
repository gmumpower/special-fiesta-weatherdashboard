/***** DAILY WEATHER CLASS******/
class DailyWeather {
    constructor(temp, humidity, iconDescription) {
      this.temp = temp;
      this.humidity = humidity;
      this.icon = {
        description: iconDescription,
      }
    }
  
    //setters
    setDate(openWeatherDate) {
      //date will convert the openWeather date to local time
      const convertedDate = new Date(openWeatherDate * 1000);
      this.date = `(${convertedDate.getMonth() + 1}/${convertedDate.getDate()}/${convertedDate.getFullYear()})`;
      return this;
    }
    setIconName(iconName, openWeatherDate) {
      //will use the current time, if time has not been set
      //openweather icons are set for UTC/GMT time, need to update appearance
      //since there might be a time difference
      this.icon.name = iconName.slice(0, iconName.length - 1) + this.generateIconEnding(openWeatherDate);
      return this;
    }
  }
  
  //gives us icon ending with day or night
  DailyWeather.prototype.generateIconEnding = function(openWeatherDate) {
    const hour = new Date(openWeatherDate * 1000).getHours();
    //if hour is between 12AM and 12PM, should be night icon
    //else, should be day icon
    return (hour >= 0 && hour < 12) ? 'n' : 'd';
  };
  
  /***** CURRENT WEATHER CLASS******/
  class CurrentWeather extends DailyWeather{
    constructor(temp, humidity, windSpeed, iconDescription) {
      super(temp, humidity, iconDescription);
      this.windSpeed = windSpeed;
    }
  
    //setter
    setUV(uvIndex) {
      this.uv = {
        index: uvIndex,
        color: this.generateUVIndexColor(uvIndex),
      }
      return this;
    }
  }
  
  //required for getting uvIndexColor
  CurrentWeather.prototype.generateUVIndexColor = function(uvIndex) {
    if (uvIndex <= 2) {
      return 'bg-secondary text-white';
    } else if (uvIndex <=5) {
      return 'bg-dark text-white';
    } else if (uvIndex <=7) {
      return 'bg-success text-white';
    } else if (uvIndex <=10) {
      return 'bg-warning text-dark';
    } else {
      return 'bg-danger text-white';
    }
  };
  
  /***** WEATHER DATA CLASS ******/
  class WeatherData {
    constructor(cityName, lat, lon) {
      this.city = {
        name: cityName,
        lat: lat,
        lon: lon,
      }
      this.nextFiveDays = [];
    }
  
    //setters
    setCurrentDay(currentDay) {
      this.currentDay = currentDay;
    }
  
    //append to nextFiveDays
    appendToNextFiveDays(day) {
      this.nextFiveDays.push(day);
    }
  }
  
  //sets current day uvi
  //sets next 5 days
  WeatherData.prototype.setOneCallInfo = function (dayList) {
    dayList.forEach(function(day, index) {
      if (index === 0) {
        this.currentDay.setUV(day.uvi);
      } else if (index <= 5) {
        let nextFiveDay = new DailyWeather(
          day.temp.day,
          day.humidity,
          day.weather[0].description)
          .setDate(day.dt)
          .setIconName(day.weather[0].icon, day.dt);
          this.appendToNextFiveDays(nextFiveDay);
      }
    }, this);
    return this;
  }
  
  /***** PAGE FUNCTIONS ******/
  //Get and display information on page load
  window.onload = function() {
    const lastSearchedCity = getLastSearchedCity();
    if (lastSearchedCity) {
      startGettingWeatherData(lastSearchedCity);
    } else {
      hideElement('curr-weather-row');
      hideElement('daily-weather-row');
    }
  }
const apiKey = "a2945bcab6a9b4bb20b5a2f2ed54b309";
/*
Have x button on buttons for clearing item from history, possibly have a favorite button
Expand button for 5 day forecast, animations(maybe blur background of the sunlight for the local area, like sun or moon)!
have it display different variations after a while
have it say good morning before you search

*/

// fxn to display weather
function displayCurrentWeather(location, type) {
    console.log(location);
    var currentDayURl;
    if (type == "LatLon") {
        let lat = location[0];
        let lon = location[1];

        console.log(`${lat}, ${lon}`)

        currentDayURl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    } else {
        currentDayURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    }

    $.ajax({
        url: currentDayURl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            item = data;
            console.log(item);
            let date = new Date(item.dt * 1000).toDateString();
            let iconName = item.weather[0].icon;
            let icon = `<img src='http://openweathermap.org/img/wn/10d@2x.png' alt='Weather Icon'>`;
            let temp = item.main.temp;
            let wind = item.wind.speed;
            let humidity = item.main.humidity;
            $("#one-day-box").empty();
            $("#one-day-box").append(`
                    <div class="one-day">
                    <h2 class="current-city" id="city-name">  </h2>
                    <h2>${date}</h2>
                    <ul>
                        <li>Temp: ${temp}°F</li>
                        <li>Wind: ${wind} mph</li>
                        <li>Humidity: ${humidity}%</li>
                    </ul>
                    ${icon}
                    <span class=""></span>
                </div>  
                    `);
                    if(type == "LatLon"){
                        getCityName(location, function(cityName){
                            if(cityName){
                                
                                $('#city-name').text(cityName);
                                console.log($('#city-name'));
                            } else{
                                // city = "";
                            }
                        });
                    } else {
                        $('#city-name').text(location);
                    }
                    
        },
        error: function () {
            console.log('1');
            apiError();
        },
    });

}

// fxn to build current day
//fxn to build 5 day
// fxn displayWeather takes location, type 

function displayFiveDayForecast(city, type) {
    const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: fiveDayURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#five-day-box").empty();

            console.log(data);
            data.list.forEach((item, index) => {
                if (item.dt_txt.includes("00:00:00")) {
                    let x = {}
                    console.log(item);
                    let dateString = item.dt_txt;
                    dateString = dateString.split("-");
                    let date = dateString[1] + '/' + dateString[2].substring(0, 2);
                    let iconName = item.weather[0].icon;
                    let icon = `<img class="icon" src='http://openweathermap.org/img/wn/${iconName}@2x.png' alt='Weather Icon'>`;
                    let temp = item.main.temp;
                    let wind = item.wind.speed;
                    let humidity = item.main.humidity;
                    let weatherColorRaw = item.weather[0].description
                    console.log(weatherColorRaw);
                    let weatherColor = weatherColorRaw.replace(/\s+/g, "_");
                    console.log(weatherColor);

                    let weatherColorHex = weatherColors[weatherColor];
                    console.log(weatherColorHex);

                    let elementId = `weather${index}-${weatherColor}`
                    $("#five-day-box").append(`
                    <div  class="five-day">
                    <h2>${date} </h2>
                    <ul>
                        <li>${temp}°F</li>
                        <li>${wind} mph</li>
                        <li>Humidity: ${humidity}%</li>
                    </ul>
                    <span id="${elementId}" class="weather-icon"></span>
                    ${icon}

                </div>  
                    `);
                    console.log(weatherColorHex);
                    let box = document.querySelector(`#${elementId}`)
                    box.style.backgroundColor = weatherColorHex;
                    box.style.opacity = "0.8";

                }
            });
        },
    });
}

// fxn that says city name is incorrect
function apiError() {
    alert("Invalid City Name");
}

// fxn to initiate local storage
function getCityNames() {
    var rawData = localStorage.getItem("cityNames");
    var cityNames = JSON.parse(rawData) || [];
    return cityNames;
}

// fxn to clear city names
function clearCityNames() {
    localStorage.clear();
    $("#success-text").text("Success!");
    setTimeout(() => {
        $("#success-text").text("");
    }, 500);
}

// fxn to save city name
function saveCity(city) {
    var cityNames = getCityNames();
    var newCityName = { city: `${city}` };
    var inside = false;
    cityNames.forEach((cityName) => {
        if (cityName.city === city) {
            inside = true;
        }
    });
    if (!inside) {
        insertHistory(city);
        cityNames.push(newCityName);
        localStorage.setItem("cityNames", JSON.stringify(cityNames));
        var test = localStorage.getItem("cityNames");
        console.log(JSON.parse(test));
    } else {
        console.log("already searched");
    }
}
// fxn to insert inputed city into history
function insertHistory(city) {
    let btnID = city.replace(/\s+/g, "");
    $("#names-container").append(`
<button id="${btnID}" class="city-name">
${city}
</button>
`);

    $(`#${btnID}`).click(function () {
        displayCurrentWeather(city);
        displayFiveDayForecast(city);
    });
}

// fxn to populate names container
function populateNames() {
    var cityNames = getCityNames();
    console.log(cityNames);
    cityNames.forEach((cityName) => {
        insertHistory(cityName.city);
    });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let currentLocation = ([(position.coords.latitude), (position.coords.longitude)]);
                resolve(currentLocation);
            }, function (error) {
                reject(error);
            });
        } else {
            reject('not availible')
        }

    });
}

//     if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(function (position) {

//         }, function () {
//             return []
//         });
//     }
// }

// fxn to initialize everything
function init() {
    getCurrentLocation()
    .then( currentLocation => {
        displayCurrentWeather(currentLocation, 'LatLon');
    })
    .catch(error => console.log(error));
    // console.log(x);
    populateNames();


}

// fxn to get the city name from lat and lon coords
function getCityName(location, callback){
    let lat = location[0];
    let lon = location[1];
    var cityNameURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    $.ajax({
        url:cityNameURL,
        type:'GET',
        success: function(data){
            if(data.address && data.address.city){
                let cityName = data.address.city;
                callback(cityName);
                // console.log(cityName);
                // return cityName
            } else {
                console.log('city not found');
                callback(null);
            }
        },
        error: function(error){
            console.log('error', error);
            callback(null);
        }
    })
}

const weatherColors = {
    "thunderstorm_with_light_rain": "#54595D",
    "thunderstorm_with_rain": "#4A5056",
    "thunderstorm_with_heavy_rain": "#40464D",
    "light_thunderstorm": "#5F656B",
    "thunderstorm": "#353B41",
    "heavy_thunderstorm": "#2B3137",
    "ragged_thunderstorm": "#20262C",
    "thunderstorm_with_light_drizzle": "#73797F",
    "thunderstorm_with_drizzle": "#696F75",
    "thunderstorm_with_heavy_drizzle": "#8B9197",

    "light_intensity_drizzle": "#A0AAB0",
    "drizzle": "#B4BEC4",
    "heavy_intensity_drizzle": "#C8D2D8",
    "light_intensity_drizzle_rain": "#DCDDE2",
    "drizzle_rain": "#B0BAD0",
    "heavy_intensity_drizzle_rain": "#94A8C8",
    "shower_rain_and_drizzle": "#7886C0",
    "heavy_shower_rain_and_drizzle": "#5C64B8",
    "shower_drizzle": "#4052B0",

    "light_rain": "#88B7D5",
    "moderate_rain": "#6CA3C1",
    "heavy_intensity_rain": "#508FAD",
    "very_heavy_rain": "#347B99",
    "extreme_rain": "#186785",
    "freezing_rain": "#004D71",
    "light_intensity_shower_rain": "#0073A8",
    "shower_rain": "#0086C3",
    "heavy_intensity_shower_rain": "#0099DE",
    "ragged_shower_rain": "#00ACF9",

    "light_snow": "#E0E0E0",
    "snow": "#E6E6E6",
    "heavy_snow": "#ECECEC",
    "sleet": "#D1D1D1",
    "light_shower_sleet": "#D7D7D7",
    "shower_sleet": "#DDDDDD",
    "light_rain_and_snow": "#F2F2F2",
    "rain_and_snow": "#F8F8F8",
    "light_shower_snow": "#FBFBFB",
    "shower_snow": "#FFFFFF",
    "heavy_shower_snow": "#F2F2F2",

    "mist": "#B3B3B3",
    "smoke": "#999999",
    "haze": "#808080",
    "sand_dust_whirls": "#666666",
    "fog": "#4D4D4D",
    "sand": "#333333",
    "dust": "#1A1A1A",
    "volcanic_ash": "#000000",
    "squalls": "#262626",
    "tornado": "#0D0D0D",

    "clear_sky": "#87CEEB",
    "few_clouds": "#8DB6CD",
    "scattered_clouds": "#9494B8",
    "broken_clouds": "#9B9BA3",
    "overcast_clouds": "#A2A28E"
};



init();
// displayCurrentWeather(city)
// displayFiveDayForecast(city)
$("#search-btn").click(function () {
    city = $("#search-input").val();
    // displayCurrentWeather(city)
    // displayFiveDayForecast(city)
    saveCity(city);
});
$("#clear-btn").click(function () {
    clearCityNames();
});

// $.get(url)
//     .then(function(data){
//         console.log(data);
//     });

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

        console.log(`${lat}, ${lon}`);

        currentDayURl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    } else {
        currentDayURl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    }

    $.ajax({
        url: currentDayURl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            item = data;
            console.log(item);
            let date = formatDate(item.dt_text).fullDate; //new Date(item.dt * 1000).toDateString();
            let description = item.weather[0].description;
            let iconName = item.weather[0].icon;
            let icon = `<img class="one-day-icon" src='http://openweathermap.org/img/wn/${iconName}@2x.png' alt='Weather Icon'>`;
            let temp = Math.floor(item.main.temp);
            let tempMax = Math.floor(item.main.temp_max);
            let tempMin = Math.floor(item.main.temp_min);

            let wind = item.wind.speed;
            let humidity = item.main.humidity;
            let weatherColorHex = getWeatherColor(description);

            $("#one-day-box").empty();
            $("#one-day-box").append(`
                <div class="one-day">
                    
                    <h2>${temp}°F
                        <div class="flex-row">
                            <ul>
                                <li>H: ${tempMax}°</li>
                                <li>L: ${tempMin}°</li>
                            </ul>
                            <div class="flex-column justify-between">
                                <img class="humidity-icon" src='/assets/images/cloud-humid-svgrepo-com.png' alt='Weather Icon'> 
                                <img class="wind-icon" src='/assets/images/wind-svgrepo-com.png' alt='Weather Icon'>                    
                            </div>
                        </div>
                    </h2>
                    <ul>
                        <li>${description}</li>
                        <li>Wind: ${wind} mph</li>
                        <li>Humidity: ${humidity}%</li>
                    </ul>
                    <h3 id="city-name"> </h3>
                    <h3>${date}</h3>

                    ${icon}
                    <span class="bgcolor"></span>
                </div>  
                    `);
            let box = document.querySelector(`.bgcolor`);
            weatherColorHex = `#${weatherColorHex}`;
            console.log(weatherColorHex);
            box.style.backgroundColor = weatherColorHex;
            box.style.opacity = "0.5";
            if (type == "LatLon") {
                getCityName(location, function (cityName) {
                    if (cityName) {
                        $("#city-name").text(`${cityName}`);
                        console.log($("#city-name"));
                    } else {
                        // city = "";
                    }
                });
            } else {
                $("#city-name").text(location);
                saveCity(location);
            }
        },
        error: function () {
            apiError();
        },
    });
}

// fxn to build current day
//fxn to build 5 day
// fxn displayWeather takes location, type

function displayFiveDayForecast(location, type) {
    var fiveDayURL;
    if (type == "LatLon") {
        let lat = location[0];
        let lon = location[1];

        console.log(`${lat}, ${lon}`);

        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    } else {
        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;
    }

    // const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: fiveDayURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#five-day-box").empty();
            console.log(data);
            data.list.forEach((item, index) => {
                if (item.dt_txt.includes("00:00:00")) {

                    let dateString = item.dt_txt;
                    let day = formatDate(dateString).fullDay;
                    let date = formatDate(dateString).fullDate;
                    console.log(item)
                    // console.log(date2);
                    console.log(dateString);
                    dateString = dateString.split("-");
                    let date2 = dateString[1] + "/" + dateString[2].substring(0, 2);
                    let iconName = item.weather[0].icon;
                    let icon = `<img class="icon" src='http://openweathermap.org/img/wn/${iconName}@2x.png' alt='Weather Icon'>`;
                    let temp = Math.floor(item.main.temp);
                    let tempMax = Math.floor(item.main.temp_max);
                    let tempMin = Math.floor(item.main.temp_min);
                    let wind = item.wind.speed;
                    let humidity = item.main.humidity;

                    let weatherColorHex = getWeatherColor(item.weather[0].description);

                    let elementId = `weather${index}-${weatherColorHex}`;
                    $("#five-day-box").append(`
                    <div  class="five-day">
                    <h2>${temp}°F
                    <div class="flex-row justify-between">
                        <div class="flex-row">
                            <div class="flex-column justify-between">
                                <p>H: ${tempMax}°</p>
                                <p>L: ${tempMin}°</p>
                            </div>
                            <div class="flex-column justify-between">
                                <span class="flex-row align-items-center"><img class="humidity-icon" src='/assets/images/cloud-humid-svgrepo-com.png' alt='Weather Icon'>    <p>${humidity}<span class="symbol">%</span></p>           </span>     

                                <span class="flex-row align-items-center"><img class="wind-icon" src='/assets/images/wind-svgrepo-com.png' alt='Weather Icon'>   <p>${wind}<span class="symbol">mph</span></p>           </span>     
                            </div>
                        </div>
                        <div class="flex-one justify-center weather-icon">
                        ${icon}
                        </div>
                        
                        <div class="flex-column justify-between date">
                            <p class="day">${day}</p>
                            <p class="smaller-date">${date}</p>
                        </div>
                    </div>
                </h2>
                    


                    <span id="${elementId}" class="bgcolor"></span>
                    

                </div>  
                    `);

                    let box = document.querySelector(`#${elementId}`);
                    weatherColorHex = `#${weatherColorHex}`;
                    console.log(weatherColorHex);
                    box.style.backgroundColor = weatherColorHex;
                    box.style.opacity = "0.6";
                }
            });
        },
        error: function () { },
    });
}
// fxn to color weatherbox
function colorWeatherBox(elementID) {
    let id = `#${elementID}`;
}
// fxn to get weatherColor
function getWeatherColor(desc) {
    let weatherColorRaw = desc;
    let weatherColor = weatherColorRaw.replace(/\s+/g, "_");
    return weatherColors[weatherColor];
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
        console.log(cityName.city);
        insertHistory(cityName.city);
    });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    let currentLocation = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    resolve(currentLocation);
                },
                function (error) {
                    reject(error);
                }
            );
        } else {
            reject("not availible");
        }
    });
}

// fxn to initialize everything
function init() {
    getCurrentLocation()
        .then((currentLocation) => {
            displayCurrentWeather(currentLocation, "LatLon");
            displayFiveDayForecast(currentLocation, "LatLon");
        })
        .catch((error) => console.log(error));
    populateNames();
}

// fxn to get the city name from lat and lon coords
function getCityName(location, callback) {
    let lat = location[0];
    let lon = location[1];
    var cityNameURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    $.ajax({
        url: cityNameURL,
        type: "GET",
        success: function (data) {
            if (data.address && data.address.city) {
                let cityName = data.address.city;
                callback(cityName);
                // console.log(cityName);
                // return cityName
            } else {
                console.log("city not found");
                callback(null);
            }
        },
        error: function (error) {
            console.log("error", error);
            callback(null);
        },
    });
}

//fxn to properly capitilze city name
function capitilze(string) {
    console.log(string);
    if (!string || typeof string !== "string") return;
    return string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

// fxn to return different formatted dates
function formatDate(dateString) {
    const date = dayjs(dateString);
    return {
        abbreviatedDayNameUpper: date.format("ddd").toUpperCase(), // 'SAT'
        abbreviatedDayNameLower: date.format("ddd"), // 'Sat'
        fullDay: date.format('dddd'),
        fullDate: date.format("MM/DD/YY"), // '12/30/2023'
        monthDay: date.format("MM/DD"), // '12/30'
        fullMonthName: date.format("MMMM"), // 'December'
        abbreviatedMonthNameUpper: date.format("MMM").toUpperCase(), // 'DEC'
        abbreviatedMonthNameLower: date.format("MMM"), // 'Dec'
    };
}

const weatherColors = {
    thunderstorm_with_light_rain: "54595D",
    thunderstorm_with_rain: "4A5056",
    thunderstorm_with_heavy_rain: "40464D",
    light_thunderstorm: "5F656B",
    thunderstorm: "353B41",
    heavy_thunderstorm: "2B3137",
    ragged_thunderstorm: "20262C",
    thunderstorm_with_light_drizzle: "73797F",
    thunderstorm_with_drizzle: "696F75",
    thunderstorm_with_heavy_drizzle: "8B9197",

    light_intensity_drizzle: "A0AAB0",
    drizzle: "B4BEC4",
    heavy_intensity_drizzle: "C8D2D8",
    light_intensity_drizzle_rain: "DCDDE2",
    drizzle_rain: "B0BAD0",
    heavy_intensity_drizzle_rain: "94A8C8",
    shower_rain_and_drizzle: "7886C0",
    heavy_shower_rain_and_drizzle: "5C64B8",
    shower_drizzle: "4052B0",

    light_rain: "88B7D5",
    moderate_rain: "6CA3C1",
    heavy_intensity_rain: "508FAD",
    very_heavy_rain: "347B99",
    extreme_rain: "186785",
    freezing_rain: "004D71",
    light_intensity_shower_rain: "0073A8",
    shower_rain: "0086C3",
    heavy_intensity_shower_rain: "0099DE",
    ragged_shower_rain: "00ACF9",

    light_snow: "E0E0E0",
    snow: "E6E6E6",
    heavy_snow: "ECECEC",
    sleet: "D1D1D1",
    light_shower_sleet: "D7D7D7",
    shower_sleet: "DDDDDD",
    light_rain_and_snow: "F2F2F2",
    rain_and_snow: "F8F8F8",
    light_shower_snow: "FBFBFB",
    shower_snow: "FFFFFF",
    heavy_shower_snow: "F2F2F2",

    mist: "B3B3B3",
    smoke: "999999",
    haze: "808080",
    sand_dust_whirls: "666666",
    fog: "4D4D4D",
    sand: "333333",
    dust: "1A1A1A",
    volcanic_ash: "000000",
    squalls: "262626",
    tornado: "0D0D0D",

    clear_sky: "87CEEB",
    few_clouds: "8DB6CD",
    scattered_clouds: "9494B8",
    broken_clouds: "9B9BA3",
    overcast_clouds: "A2A28E",
};
const first = true;

init();
// displayCurrentWeather(city)
// displayFiveDayForecast(city)
$("#search-btn").click(function () {
    city = $("#search-input").val();
    capitilziedCity = capitilze(city);
    displayCurrentWeather(capitilziedCity);
    displayFiveDayForecast(capitilziedCity);
    console.log(capitilziedCity);
});
$("#clear-btn").click(function () {
    clearCityNames();
});

// $.get(url)
//     .then(function(data){
//         console.log(data);
//     });

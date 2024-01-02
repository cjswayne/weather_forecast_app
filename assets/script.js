const apiKey = "a2945bcab6a9b4bb20b5a2f2ed54b309";
// Colors assigned to different item.weather[0].description's where item is data from OpenWeather
const weatherColors = {
    thunderstorm_with_light_rain: "rgba(84, 89, 93, 0.5)",
    thunderstorm_with_rain: "rgba(74, 80, 86, 0.5)",
    thunderstorm_with_heavy_rain: "rgba(64, 70, 77, 0.5)",
    light_thunderstorm: "rgba(95, 101, 107, 0.5)",
    thunderstorm: "rgba(53, 59, 65, 0.5)",
    heavy_thunderstorm: "rgba(43, 49, 55, 0.5)",
    ragged_thunderstorm: "rgba(32, 38, 44, 0.5)",
    thunderstorm_with_light_drizzle: "rgba(115, 121, 127, 0.5)",
    thunderstorm_with_drizzle: "rgba(105, 111, 117, 0.5)",
    thunderstorm_with_heavy_drizzle: "rgba(139, 145, 151, 0.5)",
    light_intensity_drizzle: "rgba(160, 170, 176, 0.5)",
    drizzle: "rgba(180, 190, 196, 0.5)",
    heavy_intensity_drizzle: "rgba(200, 210, 216, 0.5)",
    light_intensity_drizzle_rain: "rgba(220, 221, 226, 0.5)",
    drizzle_rain: "rgba(176, 186, 208, 0.5)",
    heavy_intensity_drizzle_rain: "rgba(148, 168, 200, 0.5)",
    shower_rain_and_drizzle: "rgba(120, 134, 192, 0.5)",
    heavy_shower_rain_and_drizzle: "rgba(92, 100, 184, 0.5)",
    shower_drizzle: "rgba(64, 82, 176, 0.5)",
    light_rain: "rgba(136, 183, 213, 0.5)",
    moderate_rain: "rgba(108, 163, 193, 0.5)",
    heavy_intensity_rain: "rgba(80, 143, 173, 0.5)",
    very_heavy_rain: "rgba(52, 123, 153, 0.5)",
    extreme_rain: "rgba(24, 103, 133, 0.5)",
    freezing_rain: "rgba(0, 77, 113, 0.5)",
    light_intensity_shower_rain: "rgba(0, 115, 168, 0.5)",
    shower_rain: "rgba(0, 134, 195, 0.5)",
    heavy_intensity_shower_rain: "rgba(0, 153, 222, 0.5)",
    ragged_shower_rain: "rgba(0, 172, 249, 0.5)",
    light_snow: "rgba(224, 224, 224, 0.5)",
    snow: "rgba(230, 230, 230, 0.5)",
    heavy_snow: "rgba(236, 236, 236, 0.5)",
    sleet: "rgba(209, 209, 209, 0.5)",
    light_shower_sleet: "rgba(215, 215, 215, 0.5)",
    shower_sleet: "rgba(221, 221, 221, 0.5)",
    light_rain_and_snow: "rgba(242, 242, 242, 0.5)",
    rain_and_snow: "rgba(248, 248, 248, 0.5)",
    light_shower_snow: "rgba(251, 251, 251, 0.5)",
    shower_snow: "rgba(255, 255, 255, 0.5)",
    heavy_shower_snow: "rgba(242, 242, 242, 0.5)",
    mist: "rgba(179, 179, 179, 0.5)",
    smoke: "rgba(153, 153, 153, 0.5)",
    haze: "rgba(128, 128, 128, 0.5)",
    sand_dust_whirls: "rgba(102, 102, 102, 0.5)",
    fog: "rgba(77, 77, 77, 0.5)",
    sand: "rgba(51, 51, 51, 0.5)",
    dust: "rgba(26, 26, 26, 0.5)",
    volcanic_ash: "rgba(0, 0, 0, 0.5)",
    squalls: "rgba(38, 38, 38, 0.5)",
    tornado: "rgba(13, 13, 13, 0.5)",
    clear_sky: "rgba(135, 206, 235, 0.5)",
    few_clouds: "rgba(141, 182, 205, 0.5)",
    scattered_clouds: "rgba(148, 148, 184, 0.5)",
    broken_clouds: "rgba(155, 155, 163, 0.5)",
    overcast_clouds: "rgba(162, 162, 142, 0.5)",
};
const first = true;

// fxn to display day of weather
function displayCurrentWeather(location, type) {
    var currentDayURl;
    if (type == "LatLon") {
        let lat = location[0];
        let lon = location[1];


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

            let dateObj = formatDate(item.dt_text);
            let date = dateObj.nameMonthDayYear;

            let description = item.weather[0].description;
            let iconName = item.weather[0].icon;
            let icon = `<img class="one-day-icon" src='http://openweathermap.org/img/wn/${iconName}@2x.png' alt='Weather Icon'>`;
            let temp = Math.floor(item.main.temp);
            let tempMax = Math.floor(item.main.temp_max);
            let tempMin = Math.floor(item.main.temp_min);

            let fullDateString;
            let wind = item.wind.speed;
            let humidity = item.main.humidity;
            let weatherColorHex = getWeatherColor(description);

            $("#one-day-box").empty();
            $("#one-day-box").append(`
             
                
            <div class="one-day justify-between">
           
            <div class="flex flex-row justify-between one-day-data">
            <h2 class="temp">${temp}°F</h2>
            <div class="flex flex-row">
                <div class="flex flex-column justify-between">
                    <p>H: ${tempMax}°</p>
                    <p>L: ${tempMin}°</p>
                </div>
                <div class="flex flex-column justify-between">
                    <span class="flex flex-row align-items-center">
                    <svg class="humidity-icon"  fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23,11a5.021,5.021,0,0,1-2.5,4.331,1,1,0,0,1-1-1.732A3,3,0,0,0,18,8a2.979,2.979,0,0,0-1,.188A1,1,0,0,1,15.73,7.6a3.977,3.977,0,0,0-7.46,0A1,1,0,0,1,7,8.188,2.961,2.961,0,0,0,3,11a3.011,3.011,0,0,0,1.5,2.6,1,1,0,0,1-1,1.732A5,5,0,0,1,6,6a4.608,4.608,0,0,1,.783.067,5.971,5.971,0,0,1,10.434,0A4.608,4.608,0,0,1,18,6,5.006,5.006,0,0,1,23,11ZM12,21c-2.579,0-4-1.35-4-3.8,0-3.243,3.237-5.87,3.375-5.981a1,1,0,0,1,1.25,0C12.763,11.33,16,13.957,16,17.2,16,19.65,14.579,21,12,21Zm0-2c1.665,0,2-.688,2-1.8a6.15,6.15,0,0,0-2-3.839A6.15,6.15,0,0,0,10,17.2C10,18.312,10.335,19,12,19Z"/></svg>    
                    <p>${humidity}<span class="symbol">%</span></p>           </span>     

                    <span class="flex flex-row align-items-center"><svg class="wind-icon" width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7639 7C16.3132 6.38625 17.1115 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12H3M8.50926 4.66667C8.87548 4.2575 9.40767 4 10 4C11.1046 4 12 4.89543 12 6C12 7.10457 11.1046 8 10 8H3M11.5093 19.3333C11.8755 19.7425 12.4077 20 13 20C14.1046 20 15 19.1046 15 18C15 16.8954 14.1046 16 13 16H3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>   <p>${wind}<span class="symbol">mph</span></p></span>     
                </div>
                
            </div>
            <div class="flex flex-row">
            <p>${description}</p>
            </div>
            <div class="flex flex-one justify-center weather-icon">
            
            </div>
            
           
        </div>
        <div class="flex flex-column justify-between one-day-date">
        ${icon}
        <h3 id="city-name" class="searched-city-name"></h3>
            <p class="day"></p>
            <h3>${date}</h3>
        </div>
                    <span class="bgcolor"></span>
                </div>  
                    `);
            let box = document.querySelector(`.bgcolor`);
            // weatherColorHex = `#${weatherColorHex}`;
            let body = document.querySelector("body");
            let header = document.querySelector("header");
            header.style.backgroundColor = weatherColorHex;
            body.style.backgroundColor = weatherColorHex;

            box.style.backgroundColor = weatherColorHex;
            box.style.opacity = "0.5";
            if (type == "LatLon") {
                getCityName(location, function (cityName) {
                    if (cityName) {
                        $("#city-name").text(`${cityName}`);
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


// fxn to display next 5 days of weather
function displayFiveDayForecast(location, type) {
    var fiveDayURL;
    if (type == "LatLon") {
        let lat = location[0];
        let lon = location[1];


        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    } else {
        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;
    }


    $.ajax({
        url: fiveDayURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#five-day-box").empty();
            data.list.forEach((item, index) => {
                if (item.dt_txt.includes("00:00:00")) {
                    let dateString = item.dt_txt;
                    let day = formatDate(dateString).fullDay;
                    let date = formatDate(dateString).fullDate;

                    dateString = dateString.split("-");
                    let iconName = item.weather[0].icon;
                    let icon = `<img class="icon" src='http://openweathermap.org/img/wn/${iconName}@2x.png' alt='Weather Icon'>`;
                    let temp = Math.floor(item.main.temp);
                    let tempMax = Math.floor(item.main.temp_max);
                    let tempMin = Math.floor(item.main.temp_min);
                    let wind = item.wind.speed;
                    let humidity = item.main.humidity;

                    let weatherColorHex = getWeatherColor(item.weather[0].description);

                    let elementId = `weather${Math.floor(
                        1000000000 + Math.random() * 9000000000
                    )}`;
                    $("#five-day-box").append(`
                    <div  class="five-day">
                    <h2>${temp}°F
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row">
                            <div class="flex flex-column justify-between">
                                <p>H: ${tempMax}°</p>
                                <p>L: ${tempMin}°</p>
                            </div>
                            <div class="flex flex-column justify-between">
                                <span class="flex flex-row align-items-center">
                                <svg class="humidity-icon"  fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23,11a5.021,5.021,0,0,1-2.5,4.331,1,1,0,0,1-1-1.732A3,3,0,0,0,18,8a2.979,2.979,0,0,0-1,.188A1,1,0,0,1,15.73,7.6a3.977,3.977,0,0,0-7.46,0A1,1,0,0,1,7,8.188,2.961,2.961,0,0,0,3,11a3.011,3.011,0,0,0,1.5,2.6,1,1,0,0,1-1,1.732A5,5,0,0,1,6,6a4.608,4.608,0,0,1,.783.067,5.971,5.971,0,0,1,10.434,0A4.608,4.608,0,0,1,18,6,5.006,5.006,0,0,1,23,11ZM12,21c-2.579,0-4-1.35-4-3.8,0-3.243,3.237-5.87,3.375-5.981a1,1,0,0,1,1.25,0C12.763,11.33,16,13.957,16,17.2,16,19.65,14.579,21,12,21Zm0-2c1.665,0,2-.688,2-1.8a6.15,6.15,0,0,0-2-3.839A6.15,6.15,0,0,0,10,17.2C10,18.312,10.335,19,12,19Z"/></svg>    
 
                                <p>${humidity}<span class="symbol">%</span></p>           </span>     

                                <span class="flex flex-row align-items-center"><svg class="wind-icon" width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.7639 7C16.3132 6.38625 17.1115 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12H3M8.50926 4.66667C8.87548 4.2575 9.40767 4 10 4C11.1046 4 12 4.89543 12 6C12 7.10457 11.1046 8 10 8H3M11.5093 19.3333C11.8755 19.7425 12.4077 20 13 20C14.1046 20 15 19.1046 15 18C15 16.8954 14.1046 16 13 16H3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>   <p>${wind}<span class="symbol">mph</span></p>           </span>     
                            </div>
                        </div>
                        <div class="flex flex-one justify-center weather-icon">
                        ${icon}
                        </div>
                        
                        <div class="flex flex-column justify-between date">
                            <p class="day">${day}</p>
                            <p class="smaller-date">${date}</p>
                        </div>
                    </div>
                </h2>
                    


                    <span id='${elementId}' class="bgcolor"></span>
                    

                </div>  
                    `);
                    let box = document.querySelector(`#${elementId}`);
                    box.style.backgroundColor = weatherColorHex;
                    box.style.opacity = "0.6";
                }
            });
        },
        error: function () { },
    });
}

// fxn to get correct weather color from description
function getWeatherColor(desc) {
    let weatherColorRaw = desc;
    let weatherColor = weatherColorRaw.replace(/\s+/g, "_");
    return weatherColors[weatherColor];
}

// fxn that says city name is incorrect
function apiError() {
    alert("Invalid City Name");
}

// fxn to initiate local storage and get city names
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
    cityNames.forEach((cityName) => {
        insertHistory(cityName.city);
    });
}

// fxn to get the users current location
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
            } else {
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
    if (!string || typeof string !== "string") return;
    return string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

// fxn to return different formatted dates w/dayjs
function formatDate(dateString) {
    const date = dayjs(dateString);
    return {
        abbreviatedDayNameUpper: date.format("ddd").toUpperCase(), // 'SAT'
        abbreviatedDayNameLower: date.format("ddd"), // 'Sat'
        fullDay: date.format("dddd"), // Monday
        dayDate: date.format("DD"), // 01
        year: date.format("YYYY"), // 2023
        fullDate: date.format("MM/DD/YY"), // '12/30/2023'
        monthDay: date.format("MM/DD"), // '12/30'
        fullMonthName: date.format("MMMM"), // 'December'
        abbreviatedMonthNameUpper: date.format("MMM").toUpperCase(), // 'DEC'
        abbreviatedMonthNameLower: date.format("MMM"), // 'Dec'
        nameMonthDayYear: date.format("dddd, MMMM DD, YYYY "), // 'Tuesday, January 02, 2024'
    };
}

init();

$("#search-btn").click(function () {
    let searchInput = $("#search-input");

    city = searchInput.val();
    capitilziedCity = capitilze(city);

    searchInput.val("");
    searchInput.attr("placeholder", capitilziedCity);

    displayCurrentWeather(capitilziedCity);
    displayFiveDayForecast(capitilziedCity);
});

const apiKey = 'a2945bcab6a9b4bb20b5a2f2ed54b309';
const city = 'Seattle';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const forecasURL =1;
var mainJQ = $('main');
$.get(url)
    .then(function(data){
        console.log(data);
    });
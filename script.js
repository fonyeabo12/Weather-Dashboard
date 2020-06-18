//Dates
let startDate = moment().format('M/DD/YYYY');  // Current Date
let day1 = moment().add(1, 'days').format('M/DD/YYYY');
let day2 = moment().add(2, 'days').format('M/DD/YYYY');
let day3 = moment().add(3, 'days').format('M/DD/YYYY');
let day4 = moment().add(4, 'days').format('M/DD/YYYY');
let day5 = moment().add(5, 'days').format('M/DD/YYYY');

$(document).ready(function() {
$("#text").on("click", function(event) {
  event.preventDefault();
  let city = $("#input").val(); 
  let allCities = [];

  allCities = JSON.parse(localStorage.getItem("allCities")) || []; 
  allCities.push(city);
  localStorage.setItem("allCities", JSON.stringify(allCities));

  showWeather(city); 
});

function showWeather(city) {
  $("#daily").empty();
  $("#fiveDay").empty();
  $("#day1").empty();
  $("#day2").empty();
  $("#day3").empty();
  $("#day4").empty();
  $("#day5").empty();


  $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=45e45c0bb2ef540df33fa21a29aafa8a`, 
      method: "GET",
  }).then(function(response) {
    var icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    let { lat, lon } = geoLocation(response); 
  
    $("#daily").append(
      `<div class='col s12 m6'><h2 class='daily'>${response.name} (${startDate})&nbsp<img src='${icon}'></h2><ul class='daily'>Temperature: ${response.main.temp} °F</ul><ul class='daily'>Humidity: ${response.main.humidity}%</ul><ul class='daily'>Wind Speed: ${response.wind.speed} MPH</ul></div>`
      );
 
  
   //5 daily forecast
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/onecall?" 
  + "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=d2b58fc265a7fcf14e74baa549ab80cc",
    method: "GET",
    }).then(function(response) {
      
      let iconUrl1 = "http://openweathermap.org/img/w/" + response.daily[0].weather[0].icon + ".png";
      let iconUrl2 = "http://openweathermap.org/img/w/" + response.daily[1].weather[0].icon + ".png";
      let iconUrl3 = "http://openweathermap.org/img/w/" + response.daily[2].weather[0].icon + ".png";
      let iconUrl4 = "http://openweathermap.org/img/w/" + response.daily[3].weather[0].icon + ".png";
      let iconUrl5 = "http://openweathermap.org/img/w/" + response.daily[4].weather[0].icon + ".png";
   

      $("#daily").append(
        "<div class='col s12 m6'>"
       + "<button class='w3-button' id='uvIndex' class='daily'>" + "UV Index: " + response.current.uvi + "</button>"
       + "</div>"
       ); 

      if (response.current.uvi <3) {
        $("#uvIndex").addClass("green");
       } else if (response.current.uvi <6) {
         $("#uvIndex").addClass("yellow");
       } else if (response.current.uvi <8) {
           $("#uvIndex").addClass("orange");
       } else if (response.current.uvi <10) {
           $("#uvIndex").addClass("red");
       } else if (response.current.uvi <= 41) {
           $("#uvIndex").addClass("purple");
       };

      $("#fiveDay").append(
        `<div class='col-md-12'><h2 id='fiveDay'>5-Day Forecast:</h2>` 
      ); 
      $("#day1").append(
       `<div class='fiveDayCard card col s12 m6'><div class='card-body'><div class='card-header'>${day1}</div><div class='card-text'><img src='${iconUrl1}'></div><div class='card-text'>Temp: ${response.daily[0].temp.day} °F</div><div class='card-text'>Humidity: ${response.daily[0].humidity}%</div></div>` 
      ); 

      $("#day2").append(
        `<div class='fiveDayCard card col s12 m6'><div class='card-body'><div class='card-header'>${day2}</div><div class='card-text'><img src='${iconUrl2}'></div><div class='card-text'>Temp: ${response.daily[1].temp.day} °F</div><div class='card-text'>Humidity: ${response.daily[1].humidity}%</div></div>` 
      ); 

      $("#day3").append(
        `<div class='fiveDayCard card col s12 m6'><div class='card-body'><div class='card-header'>${day3}</div><div class='card-text'><img src='${iconUrl3}'></div><div class='card-text'>Temp: ${response.daily[2].temp.day} °F</div><div class='card-text'>Humidity: ${response.daily[2].humidity}%</div></div>` 
      ); 

      $("#day4").append(
        `<div class='fiveDayCard card col s12 m6'><div class='card-body'><div class='card-header'>${day4}</div><div class='card-text'><img src='${iconUrl4}'></div><div class='card-text'>Temp: ${response.daily[3].temp.day} °F</div><div class='card-text'>Humidity: ${response.daily[3].humidity}%</div></div>` 
      ); 

      $("#day5").append(
        "<div class='fiveDayCard card col s12 m6'>"
        +  "<div class='card-body'>"
        +  "<div class='card-header'>" + day5 +"</div>"
        +  "<div class='card-text'>" + "<img src='" + iconUrl5 + "'>" +"</div>"
        +  "<div class='card-text'>" + "Temp: " + response.daily[4].temp.day + " °F" + "</div>"
        +  "<div class='card-text'>" + "Humidity: " + response.daily[4].humidity + "%" + "</div>" 
        + "</div>" 
      ); 
      
      showCities();
      })
    })
  }  

function showCities() {
  $("#Btns").empty();
  let arrayFromStorage = JSON.parse(localStorage.getItem("allCities")) || []; 
  let arrayLength = arrayFromStorage.length; 

  for (var i = 0; i < arrayLength; i++) { 
    let cityNameFromArray = arrayFromStorage[i]; 

    $("#Btns").append (
      
      "<div class='list-group'>"
  
    
    + "<button class='list-group-item'>" + cityNameFromArray 
    + "</button>")
  } 
} 

showCities (); 

$("#Btns").on("click", ".list-group-item", function(event) {
  event.preventDefault();
  let city = ($(this).text());
  showWeather(city); 
}) 

}); 

function geoLocation(response) {
  let lat = response.coord.lat;
  let lon = response.coord.lon;
  return { lat, lon };
}

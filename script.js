const form = document.querySelector("section.top-banner form");
const input = document.querySelector("section.top-banner input");
const msg = document.querySelector("span.msg");
const cityList = document.querySelector(".ajax-section .cities");

localStorage.setItem("apiKey", EncryptStringAES("8aef61c329cdba1cb029b4c6a7ec0c2f"));

form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {

    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    let inputVal = input.value;
    let units = "metric";
    let lang = "tr";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;

    const errorMessage = (err, callback) => {
        msg.innerText = err;
        input.focus();
        setTimeout(() => {
            msg.innerText = "";
            callback();
        }, 2000);
    }

    const infoMessage = () => {
        msg.innerText = `There's no such a city name called ${inputVal}`;
        setTimeout(() => {
            msg.innerText = "";
            form.reset();
        }, 3000);
    }

    if (inputVal == "") {

        msg.innerText = "Please type a city name";
        setTimeout(() => {
            msg.innerText = "";
        }, 2500);
        form.reset();
        input.focus();
        return;
    }

    try {
        const response = await axios(url);
        const { main, name, sys, weather } = response.data;
        const iconUrl = `https://openweathermap.org/img/wn/${
            weather[0].icon}@2x.png`;

        let cityCardList = cityList.querySelectorAll(".city");
        let cityCardListArray = Array.from(cityCardList);

        if (cityCardListArray.length > 0) {
            const filteredArray = cityCardListArray.filter(card => card.querySelector(".city-name span").innerText == name);

            if (filteredArray.length > 0) {
                msg.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(() => {
                    msg.innerText = "";
                }, 5000);
                form.reset();
                input.focus();
                return;
            }
        }

        let createdCityCardLi = document.createElement("li");
        createdCityCardLi.classList.add("city");
        createdCityCardLi.innerHTML = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;
        cityList.prepend(createdCityCardLi);
        form.reset();
        input.focus();

    } catch (error) {

        errorMessage(error, infoMessage);
    }

}
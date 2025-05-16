// Navbar scroll efekti
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobil menü kontrolü
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', function () {
    // Menüyü aç/kapat
    navLinks.classList.toggle('active');

    // Link animasyonları
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.2}s`;
        }
    });

    // Burger animasyonu
    burger.classList.toggle('toggle');
});

// Aktif menü öğesi kontrolü
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    item.addEventListener('click', function () {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // Mobil modda menüyü kapat
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
            links.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});
// Hava durumu API fonksiyonları
const weatherWidget = {
    apiKey: "83b1e592d65e48f88f1155241251505", // WeatherAPI.com API anahtarınızı buraya ekleyin
    fetchWeather: function (city) {
        fetch(
            "https://api.weatherapi.com/v1/current.json?key="
            + this.apiKey
            + "&q=" + city
            + "&lang=tr"
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hava durumu bilgisi alınamadı");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error("Hava durumu yüklenemedi:", error);
                document.querySelector(".weather-temp").textContent = "--°C";
                document.querySelector(".weather-city").textContent = "Bulunamadı";
            });
    },
    displayWeather: function (data) {
        const name = data.location.name;
        const condition = data.current.condition;
        const temp = data.current.temp_c;

        // Sıcaklık ve şehir bilgisini güncelle
        document.querySelector(".weather-temp").textContent =
            Math.round(temp) + "°C";
        document.querySelector(".weather-city").textContent = name;

        // Hava durumu ikonunu güncelle
        const weatherIcon = document.querySelector(".weather-icon i");
        weatherIcon.className = this.getWeatherIcon(condition.code, data.current.is_day);
    },
    getWeatherIcon: function (conditionCode, isDay) {
        // WeatherAPI.com durum kodlarını Font Awesome ikonlarına dönüştür
        // WeatherAPI durum kodları: https://www.weatherapi.com/docs/weather_conditions.json

        // Ana durum kategorilere göre ikon eşleştirmeleri
        const iconMap = {
            // Güneşli / Açık (1000)
            1000: isDay ? "fas fa-sun" : "fas fa-moon",

            // Parçalı Bulutlu (1003)
            1003: isDay ? "fas fa-cloud-sun" : "fas fa-cloud-moon",

            // Bulutlu (1006, 1009)
            1006: "fas fa-cloud",
            1009: "fas fa-cloud",

            // Sisli (1030, 1135, 1147)
            1030: "fas fa-smog",
            1135: "fas fa-smog",
            1147: "fas fa-smog",

            // Yağmurlu (1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195)
            1063: "fas fa-cloud-rain",
            1150: "fas fa-cloud-rain",
            1153: "fas fa-cloud-rain",
            1180: "fas fa-cloud-rain",
            1183: "fas fa-cloud-rain",
            1186: "fas fa-cloud-rain",
            1189: "fas fa-cloud-rain",
            1192: "fas fa-cloud-rain",
            1195: "fas fa-cloud-rain",

            // Sağanak (1240, 1243, 1246)
            1240: "fas fa-cloud-showers-heavy",
            1243: "fas fa-cloud-showers-heavy",
            1246: "fas fa-cloud-showers-heavy",

            // Fırtına (1087, 1273, 1276, 1279, 1282)
            1087: "fas fa-bolt",
            1273: "fas fa-bolt",
            1276: "fas fa-bolt",
            1279: "fas fa-bolt",
            1282: "fas fa-bolt",

            // Karlı (1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225)
            1066: "fas fa-snowflake",
            1069: "fas fa-snowflake",
            1072: "fas fa-snowflake",
            1114: "fas fa-snowflake",
            1117: "fas fa-snowflake",
            1210: "fas fa-snowflake",
            1213: "fas fa-snowflake",
            1216: "fas fa-snowflake",
            1219: "fas fa-snowflake",
            1222: "fas fa-snowflake",
            1225: "fas fa-snowflake"
        };

        return iconMap[conditionCode] || "fas fa-cloud";
    },
    getUserLocation: function () {
        // Tarayıcı konum iznini kontrol et
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Konum bulunduğunda lat/lon ile hava durumunu getir
                    this.fetchWeatherByCoords(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                (error) => {
                    // Konum alınamazsa varsayılan bir şehir kullan
                    console.error("Konum izni reddedildi:", error);
                    this.fetchWeather("Istanbul");
                }
            );
        } else {
            // Geolocation desteklenmiyorsa varsayılan bir şehir kullan
            console.log("Tarayıcınız konum özelliğini desteklemiyor");
            this.fetchWeather("Istanbul");
        }
    },
    fetchWeatherByCoords: function (lat, lon) {
        fetch(
            "https://api.weatherapi.com/v1/current.json?key="
            + this.apiKey
            + "&q=" + lat + "," + lon
            + "&lang=tr"
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hava durumu bilgisi alınamadı");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error("Hava durumu yüklenemedi:", error);
                this.fetchWeather("Istanbul"); // Yedek olarak İstanbul'u kullan
            });
    }
};

// Sayfa yüklendiğinde hava durumu bilgisini al
document.addEventListener('DOMContentLoaded', function () {
    weatherWidget.getUserLocation();

    // Her saat başı hava durumunu güncelle
    setInterval(function () {
        weatherWidget.getUserLocation();
    }, 3600000); // 1 saat = 3600000 ms
});


async function getNutrition() {
    const query = document.getElementById("food-input").value.trim();
    const apiKey = "LocdcL0o6bA19QoPZPIcuPZb3hXx7vdcBrJvfQ05";

    if (!query) {
        alert("Lütfen bir yiyecek adı girin.");
        return;
    }

    // Arama yap: yiyeceği bul
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${apiKey}`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.foods || searchData.foods.length === 0) {
            document.getElementById("nutrition-results").innerHTML = "Yiyecek bulunamadı.";
            return;
        }

        const food = searchData.foods[0];
        const nutrients = food.foodNutrients;

        // Göstermek istediğin değerler
        const energy = getNutrient(nutrients, "Energy");
        const protein = getNutrient(nutrients, "Protein");
        const fat = getNutrient(nutrients, "Total lipid (fat)");
        const carbs = getNutrient(nutrients, "Carbohydrate, by difference");

        document.getElementById("nutrition-results").innerHTML = `
            <h3>${food.description}</h3>
            <ul>
                <li><strong>Kalori:</strong> ${energy?.value ?? 0} ${energy?.unitName ?? ""}</li>
                <li><strong>Protein:</strong> ${protein?.value ?? 0} ${protein?.unitName ?? ""}</li>
                <li><strong>Yağ:</strong> ${fat?.value ?? 0} ${fat?.unitName ?? ""}</li>
                <li><strong>Karbonhidrat:</strong> ${carbs?.value ?? 0} ${carbs?.unitName ?? ""}</li>
            </ul>
        `;
    } catch (error) {
        console.error("API Hatası:", error);
        document.getElementById("nutrition-results").innerHTML = "Bir hata oluştu.";
    }
}

function getNutrient(nutrients, name) {
    return nutrients.find(n => n.nutrientName.includes(name));
}


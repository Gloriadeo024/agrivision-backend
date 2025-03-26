module.exports = {
    getWeatherData: (location) => {
        console.log(`Fetching weather data for ${location}...`);
        return { location, temperature: "28°C", condition: "Sunny" };
    }
};

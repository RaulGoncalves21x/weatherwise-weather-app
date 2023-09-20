import { useEffect, useState } from "react";
import { LocationType } from "../home/home.component";
import LoadingBackdrop from "../common/loading-backdrop.component";

type CitySpecificationsResponse = {
  name: string;
  country: string;
};

type CurrentWeatherDataResponse = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: [
    {
      main: string;
      description: string;
    }
  ];
  wind: {
    speed: number;
    deg: number;
  };
};

type FiveDayWeatherDataResponse = {
  city: {
    sunrise: number;
    sunset: number;
  };
  list: [
    {
      dt_txt: string;
      main: {
        temp: number;
        feels_like: number;
        humidity: number;
      };
      weather: [
        {
          main: string;
          description: string;
        }
      ];
      pop: number;
      wind: {
        speed: number;
        deg: number;
      };
    }
  ];
};

type WeatherCastComponentProps = {
  cityCoords?: LocationType;
};

function WeatherCastComponent(props: WeatherCastComponentProps) {
  const { cityCoords } = props;
  const [selectedCitySpecifications, setSelectedCitySpecifications] =
    useState<CitySpecificationsResponse>();
  const [currentWeatherData, setCurrentWeatherData] =
    useState<CurrentWeatherDataResponse>();
  const [fiveDayWeatherData, setFiveDayWeatherData] =
    useState<FiveDayWeatherDataResponse>();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!cityCoords) {
      return;
    }
    setIsLoading(true);
    console.log(cityCoords);

    // Fetch city specifications
    fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${
        cityCoords.lat
      }&lon=${cityCoords.lon}&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        /* console.log(data); */
        setSelectedCitySpecifications(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
        setIsError(true);
      });

    // Fetch current weather data
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${
        cityCoords.lat
      }&lon=${cityCoords.lon}&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        /* console.log(data); */
        setCurrentWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
        setIsError(true);
      });

    // Fetch five day weather data
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${
        cityCoords.lat
      }&lon=${cityCoords.lon}&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        /* console.log(data); */
        setFiveDayWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching five day weather data:", error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false when all fetching is done
      });
  }, [cityCoords]);

  return (
    <>
      {cityCoords && !isError && (
        <div style={{ color: "white" }}>
          {selectedCitySpecifications && cityCoords ? (
            <>
              <h1>CIDADE:</h1>
              <p>
                {selectedCitySpecifications.name},
                {selectedCitySpecifications.country}
              </p>
              <p>
                {cityCoords.lat} {cityCoords.lon}
              </p>
            </>
          ) : (
            <p>error</p>
          )}
          <>
            {currentWeatherData ? (
              <>
                <h1>PREVISÃO ATUAL:</h1>
                <p>
                  temp: {currentWeatherData.main.temp} | felt temp:{" "}
                  {currentWeatherData.main.feels_like} | humidity:{" "}
                  {currentWeatherData.main.humidity} | weather:{" "}
                  {currentWeatherData.weather[0].main} | weather desc:{" "}
                  {currentWeatherData.weather[0].description} | wind speed:{" "}
                  {currentWeatherData.wind.speed} | wind deg:{" "}
                  {currentWeatherData.wind.deg} |
                </p>
              </>
            ) : (
              <p>error</p>
            )}
          </>
          <>
            {fiveDayWeatherData && fiveDayWeatherData.list ? (
              <>
                <h1>PREVISÃO 5 DIAS:</h1>
                {fiveDayWeatherData.list.map((item) => (
                  <p key={item.dt_txt}>
                    date: {item.dt_txt} | temp: {item.main.temp} | felt temp:{" "}
                    {item.main.feels_like} | humidity: {item.main.humidity} |
                    weather: {item.weather[0].main} | weather desc:{" "}
                    {item.weather[0].description} | rain prob: {item.pop} | wind
                    speed: {item.wind.speed} | wind deg: {item.wind.deg} |
                  </p>
                ))}
              </>
            ) : (
              <p>error</p>
            )}
          </>
        </div>
      )}
      {isError && (
        <div style={{ color: "white" }}>
          <h1>ERRO!</h1>
          <p>Não foi possível carregar os dados.</p>
        </div>
      )}
      <LoadingBackdrop loading={isLoading} />
    </>
  );
}

export default WeatherCastComponent;
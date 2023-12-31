import { useState } from "react";
import { LocationType } from "../home/home.component";
import LoadingBackdrop from "../common/loading-backdrop.component";
import LocationComponent from "./location/location.component";
import CurrentWeatherComponent from "./current-forecast/current-forecast.component";
import FiveDayForecastComponent from "./five-day-forecast/five-day-forecast.component";
import {
  WeatherForecastMainContainer,
  WeatherForecastWrapper,
} from "./forecast.style";
import ErrorComponent from "./error/error.component";

export type LocationSpecification = {
  name: string;
  sys: {
    country: string;
  };
  timezone: number;
};

type WeatherForecastComponentProps = {
  locationCoords?: LocationType;
};

function WeatherForecastComponent(props: WeatherForecastComponentProps) {
  const { locationCoords } = props;
  const [locationSpecification, setLocationSpecification] =
    useState<LocationSpecification>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  /*   useEffect(() => {
    if (locationSpecification?.name) {
      const updateSearchParams = () => {
        const newSearchParams = new URLSearchParams();
        newSearchParams.set("locationName", locationSpecification.name);
        setLocationName(newSearchParams);
      };
      updateSearchParams();
    }
  }, []); */

  return (
    <WeatherForecastMainContainer>
      <WeatherForecastWrapper>
        {locationCoords && !isError && (
          <>
            {locationSpecification && (
              <LocationComponent location={locationSpecification} />
            )}
            <CurrentWeatherComponent
              locationCoords={locationCoords}
              setLoadingState={setIsLoading}
              setErrorState={setIsError}
              setLocationSpecification={setLocationSpecification}
            />
            <FiveDayForecastComponent
              locationCoords={locationCoords}
              setLoadingState={setIsLoading}
              setErrorState={setIsError}
              timezone={locationSpecification?.timezone}
            />
          </>
        )}
      </WeatherForecastWrapper>
      {isError && <ErrorComponent />}
      <LoadingBackdrop loading={isLoading} />
    </WeatherForecastMainContainer>
  );
}

export default WeatherForecastComponent;

import { createContext } from 'react';

interface LocationContextData {
  locationPath: string;
}

export const LocationContext = createContext<LocationContextData>({
  locationPath: ""
});

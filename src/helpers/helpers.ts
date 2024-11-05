export function getRandomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPageNumberFromURL(url: string): number | null {
  const regex = /[?&]page=(\d+)/;
  const match = url.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

export function getRandomAirportID(airportIDs: string[]): string {
  if (airportIDs.length === 0) {
    throw new Error('The array of airport IDs is empty.');
  }
  const randomIndex = Math.floor(Math.random() * airportIDs.length);
  return airportIDs[randomIndex];
}

export function getRandomInvalidAirportID(airportIDs: string[]): string {
  const randomAirportID = getRandomAirportID(airportIDs);
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const invalidAirportID = randomAirportID + randomLetter;
  return invalidAirportID;
}

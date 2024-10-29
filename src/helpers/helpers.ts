
export function getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function getPageNumberFromURL(url: string): number | null {
    const regex = /[?&]page=(\d+)/;
    const match = url.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
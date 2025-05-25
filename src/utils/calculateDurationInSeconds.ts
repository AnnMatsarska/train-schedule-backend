export const calculateDurationInSeconds = (
  departureDate: string,
  departureTime: string,
  arrivalDate: string,
  arrivalTime: string
): number => {
  const departure = new Date(`${departureDate}T${departureTime}`);
  const arrival = new Date(`${arrivalDate}T${arrivalTime}`);
  const diffMs = arrival.getTime() - departure.getTime();

  if (isNaN(diffMs) || diffMs < 0) {
    throw new Error("Invalid date or time values.");
  }

  return Math.floor(diffMs / 1000);
};

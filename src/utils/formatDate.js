export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  // Date formatting options
  const options = { 
    year: "numeric", 
    month: "long", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
    timeZoneName: "short" // Display the timezone abbreviation
  };

  // Format the date for the user's local time
  const formattedDate = new Date(dateString).toLocaleString(undefined, options);

  return `${formattedDate}`;
};

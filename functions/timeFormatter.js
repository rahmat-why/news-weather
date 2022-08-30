import dateFormatter from "date-and-time";

function timeFormatter(timestamp) {
  const date = new Date(timestamp * 1000);
  const dateValues = dateFormatter.format(date, "DD MMMM YYYY HH:mm");

  return dateValues;
}

export default timeFormatter;

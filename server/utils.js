export function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
}

const formatDate = (inputDateString: Date) => {
  const inputDate = new Date(inputDateString);

  const day = inputDate.getUTCDate();
  const month = inputDate.getUTCMonth() + 1; // Month is zero-based, so add 1
  const year = inputDate.getUTCFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
};

export default formatDate;
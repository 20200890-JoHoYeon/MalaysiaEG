setDate = () => {
  const today = new Date();
  today.setHours(today.getHours());
  today.toISOString().replace("T", " ").substring(0, 19);

  return today;
};

module.exports = setDate;

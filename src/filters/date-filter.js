const { format } = require('date-fns');

module.exports = (value) => {
  const dateObject = new Date(value);
  return format(dateObject, 'd MMMM yyyy');
};

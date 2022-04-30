/*
 *Description: Check the input variables is empty or not
 */
module.exports = function isEmpty(value) {
  return value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
    ? true
    : false;
};

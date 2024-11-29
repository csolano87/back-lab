const getExpeditiousCache = require("express-expeditious");

const defaultOptions = {
  namespace: "expresscache",
  defaultTtl: "24 hour",
};
const cacheInit = getExpeditiousCache(defaultOptions);

module.exports = { cacheInit };

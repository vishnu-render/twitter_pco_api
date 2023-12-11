const path = require('path');
const Bree = require('bree');
const mongoose = require('mongoose');
const Cabin = require('cabin');

const bree = new Bree({
  logger: new Cabin(),
  jobs: ['twitter'],
});

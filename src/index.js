const { run } = require("./run.js");

run()
  .then(() => process.exit(0))
  .catch((err) => core.setFailed(err.message));

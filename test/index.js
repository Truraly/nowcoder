const { router, auto, express } = require('../lib/index.js');
// const { router, auto, express } = require('../src/index.js');
const app = express();
app.use("/api", router);
app.listen(7000, () => console.log("Server running on port 7000"));
setInterval(auto, 1000 * 60 * 24);

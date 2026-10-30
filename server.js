import app from './src/app/app.js';
import dbConnection from './src/config/db.js';
import config from './src/config/config.js';



const port = config.PORT;

; (async () => {
    await dbConnection();

    app.listen(port, () => {
        console.log(`server is runing on http://localhost:${port}`)
    })

})();



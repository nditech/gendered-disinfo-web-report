'use strict';

// Instantiate web server
import express from 'express';
const app = express();

// enable serving static file through public folder
app.use(express.static('public', ));

// start server
const server = app.listen(8080, () => {
	console.log(`portfolio is running on port - ${8080}`);
});

const express = require('express');
const winston = require('winston');
const app = express();
const port = 3000;

//Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

//Middleware to log requests
app.use((req, res, next) => {
    logger.log({
        level: 'info',
        message: `Received ${req.method} request for ${req.url} from ${req.ip}`
    });
    next();
});

//Arithmetic endpoints addition, Subtraction, Multiplication, Division

//Addition 
app.get('/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input parameters for addition');
        return res.status(400).send('Invalid input parameters for addition');
    }
    const result = num1 + num2;
    res.send(`Result: ${result}`);
});

//Subtraction 
app.get('/subtract', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input parameters for subtraction');
        return res.status(400).send('Invalid input parameters for subtraction');
    }
    const result = num1 - num2;
    res.send(`Result: ${result}`);
});

//Multiplication 
app.get('/multiply', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input parameters for multiplication');
        return res.status(400).send('Invalid input parameters for multiplication');
    }
    const result = num1 * num2;
    res.send(`Result: ${result}`);
});

//Division 
app.get('/divide', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (isNaN(num1) || isNaN(num2) || num2 === 0) {
        logger.error('Invalid input parameters for division');
        return res.status(400).send('Invalid input parameters for division');
    }
    const result = num1 / num2;
    res.send(`Result: ${result}`);
});

//exponentiation operation
app.get('/power', (req, res) => {
    const { base, exponent } = req.query;
    if (isNaN(base) || isNaN(exponent)) {
        logger.error('Invalid input for exponentiation');
        return res.status(400).json({ error: 'Invalid input for exponentiation' });
    }
    const result = Math.pow(parseFloat(base), parseFloat(exponent));
    logger.info(`Exponentiation: ${base} ^ ${exponent} = ${result}`);
    res.json({ result });
});


//square root operation
app.get('/sqrt', (req, res) => {
    const { num } = req.query;
    if (isNaN(num) || num < 0) {
        logger.error('Invalid input for square root');
        return res.status(400).json({ error: 'Invalid input' });
    }
    const result = Math.sqrt(parseFloat(num));
    logger.info(`Square Root: sqrt(${num}) = ${result}`);
    res.json({ result });
});

//modulo operation
app.get('/modulo', (req, res) => {
    const { num1, num2 } = req.query;
    if (isNaN(num1) || isNaN(num2) || num2 == 0) {
        logger.error('Invalid input for modulo');
        return res.status(400).json({ error: 'Invalid input' });
    }
    const result = parseFloat(num1) % parseFloat(num2);
    logger.info(`Modulo: ${num1} % ${num2} = ${result}`);
    res.json({ result });
});

//Root path
app.get('/', (req, res) => {
    res.send('SIT737 4.2C Calculator Additional Arithmetic Operations');
});

//error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Internal Server Error');
});

//Start server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

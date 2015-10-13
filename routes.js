var userRoute = require('./routes/userRoute');
var tipRoute = require('./routes/tipRoute');
var secondhandRoute = require('./routes/secondhandRoute');
var imageRoute = require('./routes/imageRoute');

var passport = require('passport');

var multer  = require('multer');
var upload = multer({ dest: './public/upload' });



module.exports = function (app) {

    // CORS header securiy
    //app.all('/*', function (req, res, next) {
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    //    next();
    //});

    app.get('/test', function (req, res, next) {
        res.json({
            test: 'this is testing'
        });
    });

    app.post('/login', userRoute.login);
    app.post('/user', userRoute.createUser);
    app.get('/user', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);
    app.put('/user/:id', userRoute.updateUser);

    app.post('/avatar', upload.single('avatar'), userRoute.updateAvatar);

    app.post('/tip', tipRoute.create);
    app.put('/tip/:id', tipRoute.update);
    app.get('/tip', tipRoute.getList);
    app.get('/tip/:id', tipRoute.getOne);
    app.delete('/tip/:id', tipRoute.delete);

    app.post('/secondhand', secondhandRoute.createItem);
    app.put('/secondhand/:id', secondhandRoute.updateItem);
    app.get('/secondhand', secondhandRoute.getList);
    app.get('/secondhand/:id', secondhandRoute.getItem);
    app.delete('/secondhand/:id', secondhandRoute.deleteItem);

    app.post('/upload', upload.single('avatar'),imageRoute.uploadImage);


    app.get('/', function (req, res) {
        res.render('index_new');
    });

};

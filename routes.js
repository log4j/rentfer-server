var userRoute = require('./routes/userRoute');
var tipRoute = require('./routes/tipRoute');
var marketRoute = require('./routes/marketRoute');
var imageRoute = require('./routes/imageRoute');
var messageRoute = require('./routes/messageRoute');

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

    app.post('/market', marketRoute.createItem);
    app.put('/market/:id', marketRoute.updateItem);
    app.get('/market', marketRoute.getList);
    app.get('/market/:id', marketRoute.getItem);
    app.delete('/market/:id', marketRoute.deleteItem);

    app.post('/image/market', upload.single('market'),imageRoute.uploadImage);


    app.post('/message', messageRoute.postMessage);
    app.get('/message', messageRoute.getMessageWith);
    app.get('/message/unread/:user',messageRoute.getUnreadMessageSize);
    app.get('/message/contact/:user',messageRoute.getRecentContact);


    app.get('/', function (req, res) {
        res.render('index_new');
    });

};

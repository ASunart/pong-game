import { express, Server, cors, os } from './dependencies.js'
const PORT = 5050; // No cambiar
// '192.168.80.31'; // Cambiar por la IP del computador
const IPaddress = '172.30.90.70';
const SERVER_IP = IPaddress;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/mupi', express.static('public-mupi'));

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({ 
        'Client Endpoint' : `http://${SERVER_IP}:${PORT}/app`,
        'Mupi Endpoint': `http://${SERVER_IP}:${PORT}/mupi` });
});
// Run on terminal: ngrok http 5050;

const io = new Server(httpServer, { path: '/real-time' });

app.post('/user', (request, response) => {
    console.log(request.body);
    response.end();
})

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize);
    });

    socket.on('mobile-instructions', instructions => {
        console.log(instructions);
        socket.broadcast.emit('mupi-instructions', instructions);
    })
});



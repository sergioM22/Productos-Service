const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de Productos!');
});

//BD en azure
const sequelize = new Sequelize('PruebaDB', 'sergioyepez', 'pru3b@_123', {
    host: 'pruebatecnica.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    }
});


const Producto = sequelize.define('Producto', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: false
});


sequelize.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

//CRUD
app.get('/productos', async (req, res) => {
    const productos = await Producto.findAll();
    res.json(productos);
});

app.get('/productos/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (producto) res.json(producto);
    else res.status(404).json({ error: 'Producto no encontrado' });
});

app.post('/productos', async (req, res) => {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (producto) {
        await producto.update(req.body);
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.delete('/productos/:id', async (req, res) => {
    const resultado = await Producto.destroy({ where: { id: req.params.id } });
    if (resultado) res.status(204).send();
    else res.status(404).json({ error: 'Producto no encontrado' });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));

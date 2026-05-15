const Cliente = require('../models/clientes');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cliente = await Cliente.getByEmail(email);

    if (!cliente) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validación simple de contraseña (en producción usar bcrypt)
    if (cliente.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // No enviamos el password al frontend
    delete cliente.password;
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    delete cliente.password;
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bcrypt = require('bcrypt');

// Função para Criptografar Senha
async function encryptPassword(password) {
  const saltRounds = 10; 
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
}

// Função para Comparar Senha
async function comparePassword(inputPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
}

module.exports = { encryptPassword, comparePassword };

function generateCode() {
    const number = Math.floor(Math.random() * 900000) + 100000;
    global.autorization = number.toString().substring(0, 6);
    console.log(global.autorization)
}

function autenticate(numb) {
  return typeof numb !== "undefined" &&  global.autorization === numb;
}

module.exports = { generateCode, autenticate };
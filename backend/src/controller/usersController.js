const ldap = require('ldapjs');
const client = ldap.createClient({
  url: ['ldap://192.168.0.22:389']
});
const {jwtSign, jwtVerify} = require('../utils/jwtUtils')
const ldapp = require('../utils/ldapUtils')
exports.login = function (req, response) {
  ldapp
    .login(req)
    .then(async (o) => {
      if (!o.groups.includes('perfilRecursosHumanos')) {
        response.status(403).send('No cuentan con los permisos')
      } else {
        response.status(200).send(await jwtSign(o))
      }
    }, (err) => {
      response.status(500).send(err);
    });
}

exports.getAllUsers = async function (req, res) {
  try {
    const payload = await jwtVerify(req.headers.authorization);
    const users = await ldapp.getAllUsers(payload)
    res.status(200).json(users)
  } catch (e) {
    if (e.code) {
      res.status(e.code).send(e.message);
    } else {
      res.status(500).send('Ocurrio un error');
    }
  }

}

const Permission = require("./Permissions");

/**
 * Simulando um usuário administrador com todas as permissões
 */
let _permissions = 0;
Object.keys(Permission).forEach(key => {
    if (typeof (Permission[key]) != "function") {
        _permissions = Permission.addPermission(_permissions, Permission[key]);
    }
});

/**
 * @param {Permission} permission Endpoint permission
 */
module.exports = permission => async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(401).json({ message: "Unauthorized", code: 401 });
        }

        /**
         * Fazer um sistema de usuários com permissões talvez exigisse muito tempo
         * portanto fiz uma pequena simulação com somente um usuário sendo ele administrador
         */
        if (auth !== "adminpassword") {
            return res.status(401).json({ message: "Unauthorized", code: 401 });
        }

        if (!Permission.hasPermission(_permissions, permission)) {
            return res.status(403).json({ message: "Missing Permissions", code: 403 });
        }

        next();
    } catch (exc) {
        console.log(exc);
        res.status(401).json({ message: "Unauthorized", code: 401 });
    }
}
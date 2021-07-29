/*
Verificar se o usuário logado
verificar se o usuario logado é um admin
caso sim, o usuário poderá prosseguir na requisição
*/
const jwt = require('jsonwebtoken');
var secret = "fsdfsdfsdfsdfsfs";

module.exports = function(req,res,next){
    const authToken = req.headers['authorization']
 
    if(authToken != undefined){ //se token existe
        const bearer = authToken.split(' ');
        var token = bearer[1];
        try {
            var decoded = jwt.verify(token, secret);
        
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.send("Você não tem permissão para isso!")
                return
            }


        } catch (err) {
            res.status(403);
            res.send(err);
            return;
        }
    }else{
        res.status(403);
        res.send("Você não está autenticado!");
        return;
    }
}

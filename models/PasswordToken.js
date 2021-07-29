//recuperação de senha
var knex = require("../database/connection");

class PasswordToken{
    
    async create(user){ //usuário irá  passar o email para recuperar a senha
           
            try {
                    var token = Date.now();    //pode usar o UUID para gerar um token mais seguro
                
                    await knex.insert({
                        user_id: user.id, // se usuario existir, gerará o token e receberá o id daquele usuário dono do email passado
                        used: 0,
                        token: token // UUID
                    }).table("passwordtokens")

                    return {status: true, token: token}

            } catch (err) {
                    console.log(err);
                    return {status: false, err: err}
            }

        
    }


    //validar toke, se existe e nao foi usado ainda
    async validate(token){
        try {
            var result = await knex.select().where({token: token}).table("passwordtokens");

            if(result.length > 0){ //se token existe
                    
                var tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }

            }else{
                return {status: false};
            }

        } catch (err) {
            console.log(err);
            return {status: false};
        }
    }

    //mostrando se o token foi usado ou nao

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }

}

module.exports = new PasswordToken();
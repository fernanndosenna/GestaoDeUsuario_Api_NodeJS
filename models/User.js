var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{

    //método - listagem de usuário
    async findAll(){
        try{

            var result = await knex.select(["id","email","role","name"]).table("users");
            return result;

        }catch(err){
            console.log(err);
            return [];
        }
    }

    //método - encontrando 1 usuário em específico
    async findById(id){
        try{

            var result = await knex.select(["id", "email", "role", "name"]).where({id: id}).table("users");

            if(result.length > 0) {         
                return result[0]     
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }


    //método - para verificar o email e então recuperar a senha
    async findByEmail(email){
        try{
            var result = await knex.select(["id","email","password","role","name"]).where({email: email}).table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }
    
    
    //cadastrado de usuário
    async new(email, password, name){
        try{

            var hash = await bcrypt.hash(password, 10);

            await knex.insert({email, password: hash, name, role: 0}).table("users");
        }catch(err){
            console.log(err);
        }
    }

    //metodo - verificando se email já existe. se retorno == false, email não existe no banco de dados
    async findEmail(email){
        try{
            var result = await knex.select("*").from("users").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        }catch{
            console.log(err);
            return false;
        }
    }

    //ediçao de usuário
    async update(id,email,name,role){
        var user = await this.findById(id);

        if(user != undefined){ //se usuário existe

            var editUser = {};

            if(email != undefined){ // se email passado existir
                if(email != user.email){ // se email for diferente do ja existente, então, será editado

                    var result = await this.findEmail(email); // procurando email no banco
                    if(result == false){    //caso nao encontrar
                        editUser.email = email;
                    }else{
                        return {status: false, err: "O e-mail já está cadastrado"}
                    }
                }
            }


            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try {
    
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true}

            } catch (err) {
                return {status: false, err: err}
            }


        }else{
            return { status: false, err: "O usuário não existe!"}
        }


    }

    //deleção
    async delete(id){
        var user = await this.findById(id);
        
        if(user != undefined){

            try {
                
                await knex.delete().where({id: id}).table("users");
                return {status: true};

            } catch (err) {
                
                return {status: false, err: err}
            
            }

        }else{
            return {status: false, err: "O usuário não existe!"}
        }
    }

    //alteracao de senha
    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
        await PasswordToken.setUsed(token);
    }



}


module.exports = new User();
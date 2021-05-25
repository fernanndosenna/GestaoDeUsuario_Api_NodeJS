var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");

var secret = "fsdfsdfsdfsdfsfs";

var bcrypt = require("bcrypt");



/*
var SMTP_CONFIG = require("../config/smtp")
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: true,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass
    },
    tls:{
        rejectUnauthorized: false,
    },
})
*/

class UserController{

    async index(req,res){

        //chamando o metodo de listagem de usuário
        var users = await User.findAll();
        res.json(users);
    }

    //método já existente em models para encontrar usuário
    async findUser(req,res){
        var id = req.params.id;
        var user = await User.findById(id);
        
        if(user == undefined){
            res.status(404);
            res.json({err: "não encontrado!"})
        }else{
            res.status(200);
            res.json(user);
        }
    }


    //método responsável por cadastrar usuário e validar
    async create(req,res){
        var { email, name, password} = req.body; // 1 recebe dados

        if(email == undefined || email == '' || email == ' ') { // 2 valida
            res.status(403);
            res.json({err: "O e-mail é inválido!"})
            return; //encerrando requisicao quando se trabalha com controller
        }
        
        // mandando para verificação de email
        var emailExists = await User.findEmail(email); 

        if(emailExists){
            res.status(406);
            res.json({err: "O e-mail já está cadastrado!"});
        }

        await User.new(email,password,name); //3 cadastra

        res.status(200);
        res.send("Tudo ok!");
    }

    //edição
    async edit(req,res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id, email, name, role);

        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo ok!")
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!")
        }
    }
    
    //delecao
    async remove(req,res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo Ok!");
        
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    //recuperando senha - passando o email que  o usuário quer recuperar senha
    async recoverPassword(req, res){
        var email = req.body.email;
        var user = await User.findByEmail(email);
        console.log(user)
        if(user != undefined){

            var result = await PasswordToken.create(user);
        }else{
            res.status(406);
            res.send("O e-mail não existe no banco de dados")
        }
          
                if(result.status){
                    //mandar email com token  atráves do nodemailer.send()
                    
                       //envio de token para o gmail
                    /*
                    const mailSent = await transporter.sendMail({

                        text: `seu token para alteração de senha ${result.token}`,
                        subject: "Token",
                        from: "Antonio Sena <antonio.fernando.pf@gmail.com>",
                        to: ['antonio.fernando.pf@gmail.com'] //substituir por app.email do cliente
                    })
                    console.log(mailSent);
                    */
                    
                    res.status(200);
                    res.send("" + result.token);
                
                }else{
                    res.status(406);
                    res.send(result.err);
                }
    

    }

    //alteração de senha
    async changePassword(req,res) {
        var token = req.body.token;
        var password = req.body.password;
        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada!");

        }else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    //metodo de login
    async login(req,res){
        var {email, password } = req.body;

        var user = await User.findByEmail(email);

        if(user != undefined){

            var result = await bcrypt.compare(password, user.password);

            if(result){
                var token = jwt.sign({ email: user.email, role: user.role}, secret);

                res.status(200);
                res.json({token: token});
            }else{
                res.status(406);
                res.json({err: "Senha incorreta!"})
            }

        }else {
            res.status(406);
            res.json({status: false, err: "O usuário não existe!"});
        }


    }

}

module.exports = new UserController();





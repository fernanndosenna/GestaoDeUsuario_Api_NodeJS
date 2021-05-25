# GestaoDeUsuarioAPI
api rest gestão de usuário com nodeJS /express

## POST /user (criação de usuário)

Exemplo de envio de dados:
```
{
    "name" : "fernandosenna",
    "email": "fernando@guia.com",
    "password": "123"
}

```

## POST /login (login)

O login de usuário gerará um específico token dando acesso algumas rotas dependendo do cargo de usuário ( role )

Exemplo de envio de dados:
```
{
    "email": "victor@guia.com",
    "password": "123"
}

```

Exemplo de Resposta obtida, caso a autenticação aconteça tudo certo, e o usuário ja esteja cadastrado ( é retornado um token )

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvckBndWlhLmNvbSIsInJvbGUiOjEsImlhdCI6MTYxODY5MTQ2OX0.j7XQKHXkKc9Ap9zjRea1nHaVn0xTCJHp-d1QzPtjBDs"
}

```

## DELETE /user/:id ( Deleção de usuário )

Sucesso : status 200

Passado um id não existente: 

error : O usuário não existe!

## PUT /user ( Edição de usuário )

```
{
    "id" : "5",
    "name" : "fernandosenna",
    "email": "fernando@guia.com"
}

```

## GET /user/:id (Encontrar um usuário em específico)

localhost:8080/user/5

Sucesso: 
```
{
    "id": 5,
    "email": "fernando@guia.com",
    "role": 1,
    "name": "fernandosenna"
}
```
Erro:

```
{
    "err": "não encontrado!"
}

```

## GET /user ( LISTAGEM DE USUÁRIO )

Resposta obtida: 

```
[
    {
        "id": 5,
        "email": "fernando@guia.com",
        "role": 1,
        "name": "fernandosenna"
    }
    ... mais users caso exista
]
```

## POST /recoverpassword ( recuperação de senha )

Deve passar o email o qual o usuário pretender trocar a senha.
```
{
    "email" : "admin@admin.com"

}
```
## POST /changepassword ( alterar a senha )

```
{
    "token" : "1620333555582",
    "password": "94773195"

}
```

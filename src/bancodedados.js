module.exports = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    numConta: 5,
    contas: [
        {
            numero: 1,
            saldo: 0,
            usuario: {
                nome: "Foo Bar",
                cpf: "00011122233",
                data_nascimento: "2021-03-15",
                telefone: "71999998888",
                email: "foo@bar.com",
                senha: "1234"
            }
        },
        {
            numero: 2,
            saldo: 1000,
            usuario: {
                nome: "Foo Bar 2",
                cpf: "00011122231",
                data_nascimento: "2021-03-15",
                telefone: "71999998888",
                email: "foo@bar2.com",
                senha: "12345"
            }
        },
        {
            numero: 3,
            saldo: 1000,
            usuario: {
                nome: "Foo Bar 2",
                cpf: "00011122232",
                data_nascimento: "2021-03-15",
                telefone: "71999998888",
                email: "helen@bar.com",
                senha: "12345"
            }
        },
        {
            numero: 4,
            saldo: 1000,
            usuario: {
                nome: "Foo Bar 2",
                cpf: "00011122233",
                data_nascimento: "2021-03-15",
                telefone: "7199999888809",
                email: "helen@bar.com",
                senha: "12345"
            }
        }



    ],
    saques: [

    ],
    depositos: [
        {
            data: "2021-08-10 23:40:35",
            numero_conta: 1,
            valor: 10000
        }
    ],
    transferencias: [
        // POST /transacoes/transferir
        {
            numero_conta_origem: 1,
            numero_conta_destino: 2,
            valor: 200,
            senha: "123456"
        }
    ]
}
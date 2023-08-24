
let { banco, contas, numConta, depositos, transferencias, saques } = require('../bancodedados');

const fs = require('fs/promises');


const listarContas = (req, res) => {
    res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const novaConta = {
        numero: numConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha

        }
    }
    contas.push(novaConta);
    console.log('Conta cadastrada com sucesso');
    return res.status(201).json();

}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const usuarioAtualizar = contas.find((a) => {
        return a.numero === Number(numeroConta);
    });
    //atualizar dados
    usuarioAtualizar.usuario.nome = nome;
    usuarioAtualizar.usuario.cpf = cpf;
    usuarioAtualizar.usuario.data_nascimento = data_nascimento;
    usuarioAtualizar.usuario.telefone = telefone;
    usuarioAtualizar.usuario.email = email;
    usuarioAtualizar.usuario.senha = senha;

    console.log('Usuario atualizado');
    return res.status(200).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const userDelete = contas.find((a) => {
        return a.numero === Number(numeroConta);
    });

    if (userDelete.saldo > 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' })
    }

    contas = contas.filter((a) => {
        return a.numero !== Number(numeroConta);
    });

    console.log('Conta excluida com sucesso');
    return res.status(204).json();

}

const depositar = (req, res) => {
    let { numero_conta, valor } = req.body;

    const contaAdepositar = contas.find((a) => {
        return a.numero === Number(numero_conta);
    });

    //adicionando o valor na conta
    contaAdepositar.saldo += valor;

    const deposito = {
        data: new Date().toLocaleString(),
        numero_conta,
        valor
    }

    depositos.push(deposito);
    console.log('Deposito efetuado');
    return res.status(200).json();




}

const listarDepositos = (req, res) => {
    res.status(200).json(depositos);
}

const listarSaques = (req, res) => {
    res.status(200).json(saques);
}

const sacar = (req, res) => {
    let { numero_conta, valor, senha } = req.body;

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' });
    }

    const contaAsacar = contas.find((a) => {
        return a.numero === Number(numero_conta);
    });

    if (contaAsacar.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'A senha informada está incorreta.' });
    }


    if (valor > contaAsacar.saldo) {
        return res.status(400).json({ mensagem: 'O valor de saque solicitado é maior que o saldo disponível em conta' })
    }

    contaAsacar.saldo -= valor;

    const saque = {
        data: new Date().toLocaleString(),
        numero_conta: Number(numero_conta),
        valor
    }
    console.log(saque);
    saques.push(saque);
    //console.log('Saque efetuato');
    return res.status(200).json();

}

const transferir = (req, res) => {
    let { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    const contaOrigem = contas.find((a) => {
        return a.numero === Number(numero_conta_origem);
    });

    const contaDestino = contas.find((a) => {
        return a.numero === Number(numero_conta_destino);
    });

    if (valor > contaOrigem.saldo) {
        return res.status(404).json({ mensagem: 'O valor solicitado é maior que o saldo disponível em conta' })
    }
    //fazer a transferencia
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transferencia = {
        data: new Date().toLocaleString(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(transferencia);
    console.log('Transferencia efetuada');

    return res.status(200).json();
}

const listarTransferencias = (req, res) => {
    res.status(200).json(transferencias);
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaSaldo = contas.find((a) => {
        return a.numero === Number(numero_conta);
    });

    console.log("Saldo informado na tela")
    return res.status(200).json({ saldo: contaSaldo.saldo });
}


const extrato = (req, res) => {
    const { numero_conta } = req.query;


    const extratoDeposito = depositos.filter((a) => {
        return a.numero_conta === Number(numero_conta);
    });

    const extratoSaque = saques.filter((a) => {
        return a.numero_conta === Number(numero_conta);
    });

    const extratoTransferenciaEnviada = transferencias.filter((a) => {
        return a.numero_conta_origem === Number(numero_conta);
    });

    const extratoTransferenciaRecebida = transferencias.filter((a) => {
        return a.numero_conta_destino === Number(numero_conta);
    });

    const extrato = {
        depositos: extratoDeposito,
        saques: extratoSaque,
        transferenciasEnviadas: extratoTransferenciaEnviada,
        transferenciasRecebidas: extratoTransferenciaRecebida
    }

    return res.status(200).json(extrato);
}
module.exports = {
    listarContas,
    listarDepositos,
    listarSaques,
    listarTransferencias,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}
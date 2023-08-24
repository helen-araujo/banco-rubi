
let { banco, contas, numConta, depositos, transferencias } = require('../bancodedados');


const verificaBanco = (req, res, next) => {
    const { senha_banco } = req.query;
    // const senhaCorreta = { 'Cubos123Bank'};
    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'A senha é obrigatoria' });
    }
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ messagem: "A senha do banco informada está incorreta!" })
    }
    next();
}

const verificaConta = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const messageErro = []

    //verificações - campo não preenchido
    if (!nome) {
        messageErro.push('nome');
    }
    if (!cpf) {
        messageErro.push('cpf');
    }
    if (!data_nascimento) {
        messageErro.push('data de nascimento');
    }
    if (!telefone) {
        messageErro.push('telefone');
    }
    if (!email) {
        messageErro.push('email');
    }
    if (!senha) {
        messageErro.push('senha');
    }
    if (messageErro.length > 0) {
        return res.status(404).json({ mensagem: `O(s) campo(s) abaixo são obrigatorio(s) : ${messageErro}` });
    }

    //verificações já existem dados iguais
    const mensagemRepetição = [];
    const verificaEmail = contas.find((a) => {
        return a.usuario.email === email;
    });

    if (verificaEmail) {
        mensagemRepetição.push('email');
    }

    const verificaCPF = contas.find((a) => {
        return a.usuario.cpf === cpf;

    });

    if (verificaCPF) {
        mensagemRepetição.push('cpf');
    }

    if (mensagemRepetição.length > 0) {
        return res.status(400).json({ mensagem: `Já existe uma conta com o(s) ${mensagemRepetição} informado` });
    }

    next();

}

const buscarConta = (req, res, next) => {
    const { numeroConta } = req.params;

    if (!numeroConta) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o numero da conta' })
    }

    const contaParametro = contas.find((a) => {
        return a.numero === Number(numeroConta);
    });

    if (!contaParametro) {
        return res.status(400).json({ mensagem: 'Numero da conta inexistente ou incorreta' })
    }
    next();
}
const verificaSaldo = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        res.status(400).json({ mensagem: 'A conta bancaria é obrigatória' })
    }
    if (!senha) {
        res.status(400).json({ mensagem: 'A senha é obrigatoria' });
    }

    const contaSaldo = contas.find((a) => {
        return a.numero === Number(numero_conta);
    });

    if (!contaSaldo) {
        return res.status(400).json({ mensagem: 'Conta bancária inválida, ou não existe' })
    }

    if (senha !== contaSaldo.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' })
    }
    next();

}

const verificarContaTransacoes = (req, res, next) => {
    let { numero_conta, valor } = req.body;

    const menssageErro = [];
    if (!numero_conta) {
        menssageErro.push('Numero da Conta');
    }
    if (!valor) {
        menssageErro.push('Valor do depósito');
    }

    if (menssageErro.length > 0)
        return res.status(400).json({ mensagem: `O(s) campo(s) abaixo são obrigatorio(s) : ${menssageErro}` });

    if (valor <= 0) {
        return res.status(403).json({ mensagem: 'É obrigatorio informar um valor acima de R$0,00' });
    }
    next();
}

const verificaDadosTransferir = (req, res, next) => {
    let { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    const messageErro = [];
    if (!numero_conta_origem) {
        messageErro.push('Numero da conta de Origem')
    }
    if (!numero_conta_destino) {
        messageErro.push('Numero da conta de Destino')
    }
    if (!valor) {
        messageErro.push('Valor')
    }
    if (!senha) {
        messageErro.push('senha');
    }

    if (messageErro.length > 0) {
        return res.status(400).json({ mensagem: `O(s) campo(s) a seguir são obrigatorio(s) : ${messageErro}` });
    }
    //validar dados
    const contaOrigem = contas.find((a) => {
        return a.numero === Number(numero_conta_origem);
    });

    const contaDestino = contas.find((a) => {
        return a.numero === Number(numero_conta_destino);
    });

    if (!contaOrigem) {
        return res.status(400).json({ mensagem: 'Conta de origem invalida ou não existe' });
    }
    if (!contaDestino) {
        return res.status(400).json({ mensagem: 'Conta de destino invalida ou não existe' })
    }
    if (contaDestino === contaOrigem) {
        return res.status(400).json({ mensagem: 'A conta de destino deve ser diferente da conta de origem' })
    }
    if (senha !== contaOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: 'A senha informada está incorreta' });
    }
    if (valor > contaOrigem.valor) {
        return res.status(400).json({ mensagem: 'O valor solicitado é maior que o saldo disponível em conta' });
    }
    next();
}
module.exports = {
    verificaBanco,
    verificaConta,
    buscarConta,
    verificarContaTransacoes,
    verificaDadosTransferir,
    verificaSaldo
}
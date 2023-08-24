const express = require('express');
const rotas = express();


const banco = require('./controller/contaBancaria');
const middle = require('./controller/middlewares');

rotas.get('/contas', middle.verificaBanco, banco.listarContas);
rotas.get('/contas/depositos', middle.verificaBanco, banco.listarDepositos);
rotas.get('/contas/saques', middle.verificaBanco, banco.listarSaques);
rotas.get('/contas/transferencias', middle.verificaBanco, banco.listarTransferencias)


rotas.post('/contas', middle.verificaConta, banco.criarConta);
rotas.put('/contas/:numeroConta/usuario', middle.buscarConta, middle.verificaConta, banco.atualizarUsuario);
rotas.delete('/contas/:numeroConta', middle.buscarConta, banco.excluirConta);

rotas.post('/transacoes/depositar', middle.verificarContaTransacoes, banco.depositar);
rotas.post('/transacoes/sacar', middle.verificarContaTransacoes, banco.sacar);
rotas.post('/transacoes/transferir', middle.verificaDadosTransferir, banco.transferir);

rotas.get('/contas/saldo', middle.verificaSaldo, banco.saldo);
rotas.get('/contas/extrato', middle.verificaSaldo, banco.extrato);



module.exports = rotas;
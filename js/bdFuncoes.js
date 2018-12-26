var db;

function initDataBase() {
    if (!window.openDatabase) {
        alert('!! Banco de dados não disponível !! \n\n Desculpe-nos pela incoveniência. Estamos trabalhando em uma versão que funcione em seu dispositivo.');
    }

    //Iniciando o banco de dados
    db = openDatabase("SIS_VendaDireta", "1.0", "Teste Web SQL Database", 500000);
    console.log(db);

    //Criando TB_Cliente
    db.transaction(function (tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TB_Cliente (" +
                "nome TEXT," +
                "observacao TEXT," +
                "id_cliente INTEGER PRIMARY KEY," +
                "telefone INTEGER," +
                "dataNasc DATE" +
            ");"
        );
    }, function (erro) {
        console.log("Erro: " + erro.message);
    }, function (tx) {
        console.log("Tabela TB_Cliente criada (ou checada)");
    });

    //Criando TB_Fornecedor
    db.transaction(function (tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TB_Fornecedor (" +
                "nome TEXT," +
                "telefone TEXT," +
                "id_fornecedor INTEGER PRIMARY KEY" +
            ");"
        );
    }, function (erro) {
        console.log("Erro: " + erro.message);
    }, function (tx) {
        console.log("Tabela TB_Fornecedor criada (ou checada)");
    });

    //Criando TB_Produto
    db.transaction(function (tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TB_Produto (" +
                "preco REAL," +
                "nome TEXT," +
                "qtdEstoque INTEGER," +
                "durabilidade INTEGER," +
                "id_produto TEXT PRIMARY KEY," +
                "id_fornecedor INTEGER," +
                "FOREIGN KEY(id_fornecedor) REFERENCES TB_Fornecedor (id_fornecedor)" +
            ");"
        );
    }, function (erro) {
        console.log("Erro: " + erro.message);
    }, function (tx) {
        console.log("Tabela TB_Produto criada (ou checada)");
    });

    //Criando TB_Pedido
    db.transaction(function (tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TB_Pedido (" +
                "total REAL," +
                "data DATE," +
                "prazo_pagamento INTEGER," +
                "pago INTEGER," +
                "id_pedido INTEGER PRIMARY KEY," +
                "id_cliente INTEGER," +
                "FOREIGN KEY(id_cliente) REFERENCES TB_Cliente (id_cliente)" +
            ");"
        );
    }, function (erro) {
        console.log("Erro: " + erro.message);
    }, function (tx) {
        console.log("Tabela TB_Pedido criada (ou checada) ");
    });

    //Criando TB_ItemPedido
    db.transaction(function (tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS TB_ItemPedido (" +
                "id_pedido INTEGER," +
                "id_produto INTEGER," +
                "qtd INTEGER," +
                "FOREIGN KEY(id_pedido) REFERENCES TB_Pedido (id_pedido)," +
                "FOREIGN KEY(id_produto) REFERENCES TB_Produto (id_produto)," +
                "PRIMARY KEY(id_pedido, id_produto)" +
            ");"
        );
    }, function (erro) {
        console.log("Erro: " + erro.message);
    }, function (tx) {
        console.log("Tabela TB_ItemPedido criada (ou checada)");
    });
}

initDataBase();

function cadCliente(e) {
    var id = document.getElementById("txt_idCli").value;
    var nome = document.getElementById("txt_nomeCli").value;
    var tele = document.getElementById("txt_telefoneCli").value;
    var nascimento = document.getElementById("txt_nascimentoCli").value;
    var obs = document.getElementById("txt_obsCli").value;
    
    if(id == undefined)
        id = 0;
    
    
    if(id == 0){
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO TB_Cliente (nome,observacao,telefone,dataNasc) VALUES (?,?,?,?)", [nome, obs, tele, nascimento]);
        }, function (erro) {
            console.log("Erro: " + erro.message);
            alert("Ocorreu um erro\nContate o administrador do sistema.");
        }, function (tx) {
            alert("Cliente cadastrado com sucesso!");
            //limpa os campos depois de um cadastro
            document.getElementById("txt_nomeCli").value = "";
            document.getElementById("txt_telefoneCli").value = "";
            document.getElementById("txt_nascimentoCli").value = "";
            document.getElementById("txt_obsCli").value = "";
        });
    }
    else{
        db.transaction(function (tx) {
            tx.executeSql("UPDATE TB_Cliente SET nome = ?, observacao = ?, telefone = ?, dataNasc = ? WHERE id_cliente = ?", [nome, obs, tele, nascimento, id]);
        }, function (erro) {
            console.log("Erro: " + erro.message);
            alert("Ocorreu um erro\nContate o administrador do sistema.");
        }, function (tx) {
            alert("Cliente atualizado com sucesso!");
            window.location = "index.html";
        });
    }

}

function cadProduto() {
    var codigo = document.getElementById("txt_codProd").value;
    var preco = document.getElementById("txt_precoProd").value;
    var nome = document.getElementById("txt_nomeProd").value;
    var codForn = $("#txt_fornecedoresProd option:selected").val();
    var qtd = document.getElementById("txt_qtdProd").value;
    var durabilidade = document.getElementById("txt_durabilidadeProd").value;

    console.log($("#txt_fornecedores option:selected"));
    
    db.transaction(function(tx, achou){
        tx.executeSql('SELECT id_produto FROM TB_Produto WHERE id_produto = ?', [codigo], function (tx, results) {
            var len = results.rows.length;
            var achou;

            
            if(len == 0)
                achou = false;
            else
                achou = true;

            //alert(achou);

            if(achou == false){
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO TB_Produto (preco,nome,qtdEstoque,durabilidade,id_fornecedor, id_produto) VALUES (?,?,?,?,?,?)",
                            [preco, nome, qtd, durabilidade, codForn, codigo]);
                }, function (erro) {
                    console.log("Erro: " + erro.message);
                    alert("Ocorreu um erro\nContate o administrador do sistema.");
                }, function (tx) {
                    alert("Produto cadastrado com sucesso!");
                    //limpa os campos depois de um cadastro
                    document.getElementById("txt_precoProd").value = "";
                    document.getElementById("txt_nomeProd").valu = "";
                    document.getElementById("txt_qtdProd").value = "";
                    document.getElementById("txt_durabilidadeProd").value = "";
                });
            }
            else{
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE TB_Produto SET preco = ?,nome = ?,qtdEstoque = ?,durabilidade = ?,id_fornecedor = ?, id_produto = ? WHERE id_produto = ?",
                            [preco, nome, qtd, durabilidade, codForn, codigo, codigo]);
                }, function (erro) {
                    console.log("Erro: " + erro.message);
                    alert("Ocorreu um erro\nContate o administrador do sistema.");
                }, function (tx) {
                    alert("Produto atualizado com sucesso!");
                    //window.location = "index.html";
                });
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function cadFornecedor() {
    var id = document.getElementById("txt_idForn").value;
    var nome = document.getElementById("txt_nomeForn").value;
    var telefone = document.getElementById("txt_telForn").value;
    
    if(id == undefined)
        id = 0;
    
    if(id == 0){
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO TB_Fornecedor (nome, telefone) VALUES (?, ?)", [nome, telefone]);
        }, function (erro) {
            console.log("Erro: " + erro.message);
            alert("Ocorreu um erro\nContate o administrador do sistema.");
        }, function (tx) {
            alert("Fornecedor cadastrado com sucesso!");
            document.getElementById("txt_nomeForn").value = "";
            document.getElementById("txt_telForn").value = "";
        });
    }
    else{
        db.transaction(function(tx){
           tx.executeSql("UPDATE TB_Fornecedor SET nome = ?, telefone = ? WHERE id_fornecedor = ?",[nome,telefone,id]); 
        }, function(erro){
            console.log("Erro: " + erro.message);
        }, function(tx){
            alert("Fornecedor atualizado com sucesso!");
            window.location = "index.html";
        });
    }
    
}

var id_pedido;

function gerarPedido() {
    //Obtendo info dos pedidos
    var id = $("#txt_idPed").val();
    var cliente = $("#txt_clientes").val();
    var total = $("#txt_total").val();
    var prazo = $("#txt_prazo").val();
    var pago = $("#txt_pago");

    if(prazo == 0)
        pago.attr("checked", true);

    if(pago.is(":checked"))
        pago = 1;
    else
        pago = 0;

    console.log("id do pedido: " + id);

    if(id == ""){
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO TB_Pedido (id_cliente,total,data,prazo_pagamento,pago) VALUES (?,?,date('now'),?,?)", [cliente, total, prazo,pago]);
        }, function (erro) {
            console.error("Erro: " + erro.message);
        }, function (tx) {
            alert("Pedido cadastrado com sucesso!");
        });

       db.transaction(function (tx) {
            console.log("executando ....");
            tx.executeSql('SELECT MAX(id_pedido) AS id FROM TB_Pedido', [], function (tx, results) {
                id_pedido = results.rows.item(0)[['id']];
                console.log("id do pedido criado: " + id_pedido);
                var idProds = $(".idPedProd");
                var Qtds = $(".qtdPedProd");
                var id;
                var qtd;

                var tam = idProds.size();

                db.transaction(function (tx) {
                    console.log("executou a inserçao dos itens....");
                    for(var i = 0 ; i < tam ; i++){
                        id = idProds[i].getAttribute('value');
                        qtd = Qtds[i].getAttribute('value');


                        console.log("Id do produto: " + id);
                        console.log("Quantidade: " + qtd);

                        tx.executeSql("INSERT INTO TB_ItemPedido (id_pedido,id_produto,qtd) VALUES (?,?,?)", [id_pedido, id, qtd]);
                    }
                }, function (erro) {
                    console.error("Error: " + erro.message);
                }, function (tx) {
                    console.log("Produto Inserido!");
                    db.transaction(function (tx) {
                        for(var i = 0 ; i < tam ; i++){
                            id = idProds[i].getAttribute('value');
                            
                            tx.executeSql("UPDATE TB_Produto SET qtdEstoque = qtdEstoque - 1 WHERE id_produto = ?", [id], function (tx) {
                                console.log("Produto retirado do estoque");
                            },
                                    function (erro) {
                                        console.error("Deu pau: " + erro.message);
                                    }
                            );
                        }
                    });
                });
            }, function (erro) {
                console.error("Deu pau: " + erro.message);
            });
        });
    }
    else {
        db.transaction(function (tx) {
            tx.executeSql("UPDATE TB_Pedido SET prazo_pagamento = ?, pago = ? WHERE id_pedido = ?", [prazo,pago,id]);
        }, function (erro) {
            console.error("Erro: " + erro.message);
        }, function (tx) {
            alert("Pedido atualizado com sucesso!");
        }); 
    }
        

    document.getElementById("txt_idPed").value = "";
    document.getElementById("txt_clientes").value = "1";
    document.getElementById("txt_prazo").value = "";
}

function obterFornecedores(nomeDiv, nomeSelect) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Fornecedor', [], function (tx, results) {
            var len = results.rows.length, i;


            resultados = "<select id='"+nomeSelect+"' data-theme='c'>";

            if (len > 0) {
                for (i = 0; i < len; i++) {
                    resultados += "<option value='" + results.rows.item(i)[['id_fornecedor']] + "'>" + results.rows.item(i)[['nome']] + "</option>";
                }
            } else {
                resultados += "<option value=0>Sem fornecedores cadastrados!</option>";
            }


            resultados += "</select>";

            document.getElementById(nomeDiv).innerHTML = resultados;
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function obterProdutos(nomeDiv) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Produto', [], function (tx, results) {
            var len = results.rows.length, i;


            resultados = "<select id='txt_produtos' data-theme='c'>";

            if (len > 0) {
                for (i = 0; i < len; i++) {
                    resultados += "<option value='" + results.rows.item(i)[['id_produto']] + "'>" + results.rows.item(i)[['nome']] + "-" + results.rows.item(i)[['preco']] + "</option>";
                }
            } else {
                resultados += "<option value=0>Sem produtos para este fornecedor!</option>";
            }


            resultados += "</select>";

            document.getElementById(nomeDiv).innerHTML = resultados;
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function obterClientes(nomeDiv) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Cliente', [], function (tx, results) {
            var len = results.rows.length, i;


            resultados = "<select id='txt_clientes' data-theme='c'>";

            if (len > 0) {
                for (i = 0; i < len; i++) {
                    resultados += "<option value='" + results.rows.item(i)[['id_cliente']] + "'>" + results.rows.item(i)[['nome']] + "</option>";
                }
            } else {
                resultados += "<option value=0>Sem clientes cadastrados!</option>";
            }


            resultados += "</select>";

            document.getElementById(nomeDiv).innerHTML = resultados;
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function selectFornecedor() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Fornecedor', [], function (tx, results) {
            var len = results.rows.length, i;

            if (len > 0) {
                $("#cons_results").empty();
                for (i = 0; i < len; i++) {
                    $('#cons_results').append("<li onclick=\"abrirFornecedores("+ results.rows.item(i)[['id_fornecedor']] +",'"+ results.rows.item(i)[['nome']] +"','"+ results.rows.item(i)[['telefone']].split(' ').join('') + "')\">" + results.rows.item(i)[['id_fornecedor']] + " - " 
                    + results.rows.item(i)[['nome']] + " - " 
                    + results.rows.item(i)[['telefone']]);
                }
            } else {
                $("#cons_results").empty();
                $('#cons_results').append("<li>Sem registros a serem mostrados!</li>");
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function selectCliente() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Cliente', [], function (tx, results) {
            var len = results.rows.length, i;

            if (len > 0) {
                $("#cons_results").empty();
                for (i = 0; i < len; i++) {
                    $('#cons_results').append("<li onclick=\"abrirClientes("+ results.rows.item(i)[['id_cliente']] +",'"+ results.rows.item(i)[['nome']] +"',"+ results.rows.item(i)[['telefone']] +",'"+ results.rows.item(i)[['dataNasc']] + "','" + results.rows.item(i)[['observacao']] +"')\">" 
                    + results.rows.item(i)[['id_cliente']] + " - " 
                    + results.rows.item(i)[['nome']] + " - " 
                    + results.rows.item(i)[['telefone']]);
                }
            } else {
                $('#cons_results').append("<li>Sem registros a serem mostrados!</li>");
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function selectProdutos(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Produto', [], function (tx, results) {
            var len = results.rows.length, i;

            if (len > 0) {
                $("#cons_results").empty();
                for (i = 0; i < len; i++) {
                    $('#cons_results').append("<li onclick=\"abrirProdutos('"+ results.rows.item(i)[['id_produto']] +"','"+ results.rows.item(i)[['nome']] +"','"+ results.rows.item(i)[['preco']] +"',"+ results.rows.item(i)[['id_fornecedor']] + "," + results.rows.item(i)[['durabilidade']] + "," + results.rows.item(i)[['qtdEstoque']] + ")\">" 
                    + results.rows.item(i)[['id_produto']] + " - " 
                    + results.rows.item(i)[['nome']] + " - " 
                    + "R$" +results.rows.item(i)[['preco']]);
                }
            } else {
                $('#cons_results').append("<li>Sem registros a serem mostrados!</li>");
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function selectPedidos(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT id_pedido, data, total, prazo_pagamento, pago, TB_Pedido.id_cliente, TB_Cliente.nome FROM TB_Pedido INNER JOIN TB_Cliente ON TB_Pedido.id_cliente = TB_Cliente.id_cliente', [], function (tx, results) {
            var len = results.rows.length, i;

            if (len > 0) {
                $("#cons_results").empty();
                for (i = 0; i < len; i++) {
                    var pago;

                    if(results.rows.item(i)[['pago']] == 1)
                        pago = "Pago";
                    else
                        pago = "Em aberto!";

                    $('#cons_results').append("<li onclick=\"abrirPedidos("+ results.rows.item(i)[['id_pedido']] +","+ results.rows.item(i)[['total']] +","+ results.rows.item(i)[['id_fornecedor']] + "," + results.rows.item(i)[['prazo_pagamento']] + "," + results.rows.item(i)[['pago']] + "," + results.rows.item(i)[['id_cliente']] + ")\">" 
                    + results.rows.item(i)[['id_pedido']] + " - "
                    + results.rows.item(i)[['nome']] + " - "
                    + converterData(results.rows.item(i)[['data']]) + " - " 
                    + "R$" + results.rows.item(i)[['total']]+ " - "
                    + pago);
                }
            } else {
                $('#cons_results').append("<li>Sem registros a serem mostrados!</li>");
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function selectItemPedido(id_pedido){
    var id = id_pedido;
    
    db.transaction(function (tx) {
        tx.executeSql('SELECT TB_Produto.id_produto, nome, preco,qtd FROM TB_Produto, TB_ItemPedido WHERE TB_Produto.id_produto = TB_ItemPedido.id_produto AND TB_ItemPedido.id_pedido = ?', [id], function (tx, results) {
            var len = results.rows.length, i;

            if (len > 0) {
                for (i = 0; i < len; i++) {
                    AddTableRow(results.rows.item(i)[['id_produto']],results.rows.item(i)[['nome']],results.rows.item(i)[['preco']],results.rows.item(i)[['qtd']]);
                }
            }
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function getAniversariantesMes(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM TB_Cliente', [], function (tx, results) {
            var len = results.rows.length, i;
            var dataAtual = new Date();

            if (len > 0) {
                for (i = 0; i < len; i++) {
                    var dataNasc = new Date(results.rows.item(i)[['dataNasc']]);
                    if(dataAtual.getMonth() == dataNasc.getMonth()){
                        $('#table_aniversarios').append("<tr><td>"+ results.rows.item(i)[['nome']] 
                            +"</td><td>" + converterData(results.rows.item(i)[['dataNasc']]) 
                            +"</td><td><a href='sms:"+ results.rows.item(i)[['telefone']] +"?body=Parabéns, " + results.rows.item(i)[['nome']] + "! Aproveite o seu aniversario e se presenteie! Ligue pra mim ou responda esse SMS :)' data-role=\"button\" class='ui-btn ui-shadow ui-corner-all ui-icon-mail ui-btn-icon-notext'  data-theme=\"b\"></a>"
                            +"</td><td><a href='tel:"+ results.rows.item(i)[['telefone']] +"' data-role='button' class='ui-btn ui-shadow ui-corner-all ui-icon-phone ui-btn-icon-notext' id='btn_Ligar'></a></td></tr>");
                    }
                }
            }

        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}

function getProdutosVendidos(){
    var data = new Date();
    document.getElementById("relHeader").innerHTML = "";
    document.getElementById("relHeader").innerHTML += "<img src='data:image/png;base64,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' height='128' width='260'>";
    document.getElementById("relHeader").innerHTML += "<h2>Produtos vendidos no dia " + data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear() + "</h2>"
    document.getElementById("relHeader").innerHTML += "<h3>Fornecedor: " + $('#txt_fornecedoresInicio').children("option:selected").text() + "</h3>";

    $("#table_produtosDoDia > tbody").empty();
    var id_forn = $("#txt_fornecedoresInicio").val();

    db.transaction(function (tx) {
        var query = "SELECT TB_Produto.id_produto, nome, qtd FROM TB_Produto INNER JOIN TB_ItemPedido ON TB_Produto.id_produto = TB_ItemPedido.id_produto INNER JOIN TB_Pedido ON TB_Pedido.id_pedido = TB_ItemPedido.id_pedido WHERE id_fornecedor = ? AND data = date('now')";
        tx.executeSql(query, [id_forn], function (tx, results) {
            var len = results.rows.length, i;
            var linha = "";
            var somaqtd = 0;

            if (len > 0) {
                for (i = 0; i < len; i++) {

                    for(var y = 0 ; y < len ; y++){
                        if(results.rows.item(i)[['id_produto']] == results.rows.item(y)[['id_produto']]){
                            somaqtd += results.rows.item(y)[['qtd']];
                        }
                    }

                    linha += "<tr>";
                    linha += "<td>" + results.rows.item(i)[['id_produto']] + "</td>";
                    linha += "<td>" + results.rows.item(i)[['nome']] + "</td>";
                    linha += "<td>"+ somaqtd +"</td>";
                    linha += "</tr>";

                    $("#table_produtosDoDia").append(linha);

                    somaqtd = 0;
                    linha = "";
                }
            }else{
                $("#table_produtosDoDia").append("<tr><td colspan='3' align='center'>Sem produtos vendidos!</td></tr>")
            }

            removerDup();
        }, function (erro) {
            alert("Deu pau: " + erro.message);
        });
    });
}
// Dados dos pacientes
const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

// Elementos do DOM
const elementos = {
    nome: document.getElementById("nome"),
    idade: document.getElementById("idade"),
    condicao: document.getElementById("condicao"),
    lista: document.getElementById("lista"),
    botaoCadastrar: document.getElementById("btnCadastrar"),
    selectStrategy: document.getElementById("strategySelect")
};

// Estratégias para renderizar a lista
class ListaSimples {
    render(pacientes, container) {
        container.innerHTML = "";
        pacientes.forEach(p => {
            container.appendChild(this.criarCard(p));
        });
    }
    criarCard(paciente) {
        const div = document.createElement("div");
        div.className = "paciente";
        div.innerText = `${paciente.nome} (${paciente.idade} anos) - ${paciente.condicao}`;
        return div;
    }
}

class ListaOrdenadaPorNome {
    render(pacientes, container) {
        const ordenados = [...pacientes].sort((a, b) => a.nome.localeCompare(b.nome));
        container.innerHTML = "";
        ordenados.forEach(p => {
            container.appendChild(this.criarCard(p));
        });
    }
    criarCard(paciente) {
        const div = document.createElement("div");
        div.className = "paciente";
        div.innerText = `${paciente.nome} (${paciente.idade} anos) - ${paciente.condicao}`;
        return div;
    }
}

class ListaFiltradaPorCondicao {
    constructor(condicaoFiltro) {
        this.condicaoFiltro = condicaoFiltro.toLowerCase();
    }
    render(pacientes, container) {
        const filtrados = pacientes.filter(p =>
            p.condicao.toLowerCase().includes(this.condicaoFiltro)
        );
        container.innerHTML = "";
        filtrados.forEach(p => {
            container.appendChild(this.criarCard(p));
        });
    }
    criarCard(paciente) {
        const div = document.createElement("div");
        div.className = "paciente";
        div.innerText = `${paciente.nome} (${paciente.idade} anos) - ${paciente.condicao}`;
        return div;
    }
}

// Contexto que utiliza a estratégia
class ListaPacientesContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    render(pacientes, container) {
        this.strategy.render(pacientes, container);
    }
}

// Inicialização
let contextoLista = new ListaPacientesContext(new ListaSimples());

// Funções utilitárias
function salvarPacientes() {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

function limparFormulario() {
    elementos.nome.value = "";
    elementos.idade.value = "";
    elementos.condicao.value = "";
}

function formularioValido(paciente) {
    return paciente.nome && paciente.idade && paciente.condicao;
}

function lerDadosFormulario() {
    return {
        nome: elementos.nome.value.trim(),
        idade: elementos.idade.value.trim(),
        condicao: elementos.condicao.value.trim()
    };
}

function cadastrarPaciente() {
    const paciente = lerDadosFormulario();

    if (!formularioValido(paciente)) {
        alert("Preencha todos os campos!");
        return;
    }

    pacientes.push(paciente);
    salvarPacientes();
    atualizarLista();
    limparFormulario();
}

function atualizarLista() {
    contextoLista.render(pacientes, elementos.lista);
}

// Event listeners
elementos.botaoCadastrar.addEventListener("click", cadastrarPaciente);

elementos.selectStrategy.addEventListener("change", (e) => {
    const valor = e.target.value;
    switch (valor) {
        case "simples":
            contextoLista.setStrategy(new ListaSimples());
            break;
        case "ordenado":
            contextoLista.setStrategy(new ListaOrdenadaPorNome());
            break;
        case "filtrado":
            contextoLista.setStrategy(new ListaFiltradaPorCondicao("Diabetes"));
            break;
    }
    atualizarLista();
});

// Render inicial
atualizarLista();
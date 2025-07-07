let contador = 0;
let draggedItem = null;
let taskInput = document.getElementById('inputTarefa');
let addButton = document.getElementById('btn-add');
let taskList = document.getElementById('areaLista');

function criarElementoTarefa(id, texto) {
    const div = document.createElement('div');
    
    div.className = 'item';
    div.id = `item-tarefa-${id}`;
    div.draggable = true;
    div.ondragstart = dragStart;
    div.ondragover = dragOver;
    div.ondrop = drop;
    div.ondragend = dragEnd;

    div.innerHTML = `
        <div class="item-icone" onclick="marcarTarefa('${div.id}')">
            <i class="mdi mdi-circle-outline" id="icone-${id}"></i>
        </div>
        <div class="item-nome" onclick="marcarTarefa('${div.id}')">
            ${texto}
        </div>
        <div class="item-botao">
            <button class="delete" onclick="deletarTarefa('${div.id}')">
                <i class="mdi mdi-delete"></i> Deletar
            </button>
        </div>`;

    return div;
}

function adicionarTarefa() {
    let valorInput = taskInput.value;

    if (valorInput && valorInput.trim() !== "") {

        ++contador;

        const novoElemento = criarElementoTarefa(contador, valorInput);
        const primeiroMarcado = Array.from(taskList.children).find(el => el.classList.contains('clicado'));

        if (primeiroMarcado) {
            taskList.insertBefore(novoElemento, primeiroMarcado);
        } else {
            taskList.appendChild(novoElemento);
        }
        
        taskInput.value = "";
        taskInput.focus();
    }
}

taskInput.addEventListener("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        addButton.click();
    }
});

function marcarTarefa(id){
    let item = document.getElementById(id);
    let classeAtual = item.getAttribute('class');
    let icone = document.getElementById('icone-' + id.replace('item-tarefa-', ''));

    if(classeAtual == "item"){
        item.classList.add('clicado');
        icone.classList.remove('mdi-circle-outline');
        icone.classList.add('mdi-check-circle');
        reposicionarItemMarcado();
    }
    else{
        item.classList.remove('clicado');
        icone.classList.remove('mdi-check-circle');
        icone.classList.add('mdi-circle-outline');
        reposicionarItemDesmarcado(item);
    }
}

function deletarTarefa(id){
    let tarefa = document.getElementById(id);
    tarefa.remove();
}

function reposicionarItemMarcado() {
    const itensClicados = document.querySelectorAll('.item.clicado');
    itensClicados.forEach(item => {
        taskList.appendChild(item);
    });
}

function reposicionarItemDesmarcado(itemDesmarcado) {
    const todosItens = Array.from(taskList.querySelectorAll('.item'));
    const primeiroMarcado = todosItens.find(el => el.classList.contains('clicado'));

    if (primeiroMarcado) {
        taskList.insertBefore(itemDesmarcado, primeiroMarcado);
    } else {
        taskList.appendChild(itemDesmarcado);
    }
}

function dragStart(event) {
    draggedItem = event.currentTarget;
    draggedItem.classList.add('dragging');
}

function dragEnd(event) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    const itemDestino = event.currentTarget;

    if (draggedItem === itemDestino) return;

    const draggedItemEstaMarcado  = draggedItem.classList.contains('clicado');
    const itemDestinoEstaMarcado = itemDestino.classList.contains('clicado');

    if (!draggedItemEstaMarcado && !itemDestinoEstaMarcado) {
        taskList.insertBefore(draggedItem, itemDestino);
    }

    reposicionarItemMarcado();
}
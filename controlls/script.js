document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------
  // 1. Lógica de Abas (Divisão de Treinos)
  // ----------------------------------------------------
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      // Desativa todos
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Ativa o botão e o conteúdo correspondente
      button.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // ----------------------------------------------------
  // 2. Lógica de Adicionar/Remover Exercícios
  // ----------------------------------------------------
  const addExercicioBtns = document.querySelectorAll(".add-exercicio-btn");
  // Objeto para manter a contagem de exercícios por aba (Treino A, B, C, etc.)
  const exercicioCounts = {
    "tab-a": 0,
    "tab-b": 0,
    "tab-c": 0,
  };

  // Função para criar o HTML de um exercício
  const createExercicioHTML = (tabId) => {
    exercicioCounts[tabId]++;
    const count = exercicioCounts[tabId];
    const uniqueId = `${tabId}-ex-${count}`;

    return `
            <div class="exercicio-item" data-unique-id="${uniqueId}">
                <h4>Exercício ${count}</h4>
                <button class="remover-exercicio-btn" data-id="${uniqueId}">Remover</button>

                <label>Nome do Exercício:</label>
                <input type="text" placeholder="Ex: Agachamento Livre, Supino Reto, Remada Curvada">
                
                <label>Séries:</label>
                <input type="number" value="3" min="1" style="width: 50px; display: inline-block;">
                
                <label>Repetições:</label>
                <input type="text" value="10-12" placeholder="Ex: 8-12 ou 10 Reps">
                
                <label>Carga (Opcional):</label>
                <input type="text" placeholder="Ex: 20kg (cada lado) ou Carga Máx.">

                <label>Intervalo (seg):</label>
                <input type="number" value="60" min="10" style="width: 50px; display: inline-block;">
                
                <label>Observação/Técnica:</label>
                <input type="text" placeholder="Ex: Cadência 3-1-1; Falha Concêntrica">
            </div>
        `;
  };

  addExercicioBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabId = e.target.getAttribute("data-target");
      const lista = document.querySelector(`#${tabId} .exercicios-lista`);

      lista.insertAdjacentHTML("beforeend", createExercicioHTML(tabId));
    });
  });

  // Lógica de Remover (Delegando o evento ao container principal)
  document.querySelector(".container").addEventListener("click", (e) => {
    if (e.target.classList.contains("remover-exercicio-btn")) {
      const uniqueId = e.target.getAttribute("data-id");
      const elementToRemove = document.querySelector(
        `.exercicio-item[data-unique-id="${uniqueId}"]`
      );
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }
  });

  // ----------------------------------------------------
  // 3. Simulação de Envio
  // ----------------------------------------------------
  document
    .getElementById("gerar-planilha-btn")
    .addEventListener("click", () => {
      const aluno = document.getElementById("aluno").value;
      alert(
        `Planilha de Treino de ${aluno} Gerada com Sucesso!\n\nIremos simular o envio direto para o aluno ou download em PDF/Ficha de Avaliação. Você não precisa mais se preocupar com planilhas manuais!`
      );
    });
});

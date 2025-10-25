// copie este arquivo para controlls/script.js (versão estável)
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => {
        content.classList.remove("active");
        content.style.display = "none";
      });
      button.classList.add("active");
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
        targetTab.style.display = "block";
      }
    });
  });

  const addExercicioBtns = document.querySelectorAll(".add-exercicio-btn");
  const exercicioCounts = { "tab-a": 0, "tab-b": 0, "tab-c": 0 };

  const createExercicioHTML = (tabId) => {
    exercicioCounts[tabId] = (exercicioCounts[tabId] || 0) + 1;
    const count = exercicioCounts[tabId];
    const uniqueId = `${tabId}-ex-${count}`;

    return `
      <div class="exercicio-item" data-unique-id="${uniqueId}">
        <h4>Exercício ${count}</h4>
        <button class="remover-exercicio-btn" data-id="${uniqueId}">Remover</button>

        <label>Nome do Exercício:</label>
        <input type="text" placeholder="Ex: Supino Reto, Agachamento, Remada Curvada">

        <label>Séries:</label>
        <input type="number" value="3" min="1" style="width: 60px; display:inline-block;">

        <label>Repetições:</label>
        <input type="text" value="10-12" placeholder="Ex: 8-10 ou 12 reps">

        <label>Carga (Opcional):</label>
        <input type="text" placeholder="Ex: 20kg cada lado ou carga máxima">

        <label>Intervalo (seg):</label>
        <input type="number" value="60" min="10" style="width: 60px; display:inline-block;">

        <label>Observações / Técnica:</label>
        <input type="text" placeholder="Ex: Cadência 3-1-1, até a falha concêntrica">
      </div>
    `;
  };

  addExercicioBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabId = e.target.getAttribute("data-target");
      const lista = document.querySelector(`#${tabId} .exercicios-lista`);
      if (lista)
        lista.insertAdjacentHTML("beforeend", createExercicioHTML(tabId));
    });
  });

  document.querySelector(".container")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("remover-exercicio-btn")) {
      const uniqueId = e.target.getAttribute("data-id");
      const item = document.querySelector(`[data-unique-id="${uniqueId}"]`);
      if (item) item.remove();
    }
  });

  const firstTab = document.querySelector(".tab-button.active");
  if (firstTab) {
    const initialTab = firstTab.getAttribute("data-tab");
    const el = document.getElementById(initialTab);
    if (el) el.style.display = "block";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ... (restante do seu código: abas, adicionar/remover, etc.) ...

  // ----------------------------------------------------
  // 4. Lógica de Geração de PDF
  // ----------------------------------------------------
  const gerarPdfBtn = document.getElementById("gerar-pdf-btn");

  gerarPdfBtn.addEventListener("click", () => {
    const element = document.getElementById("planilha-content");

    // Configurações do PDF
    const options = {
      margin: 1,
      filename:
        "Planilha_" +
        document.getElementById("aluno").value.replace(/\s/g, "") +
        ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // Maior escala para melhor qualidade
        logging: false,
        // A chave para o estilo: o html2canvas renderiza todo o HTML,
        // incluindo cores de fundo e estilos aplicados via CSS.
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // NOTA IMPORTANTE: Para que o PDF capture as 3 divisões (A, B e C),
    // você precisa temporariamente torná-las visíveis ANTES de gerar o PDF.

    // 1. Torna todos os conteúdos de treino visíveis
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.style.display = "block";
      tab.classList.add("pdf-visible"); // Adiciona uma classe temporária
    });

    // 2. Remove o botão "Remover" de cada exercício, para não aparecer no PDF
    document.querySelectorAll(".remover-exercicio-btn").forEach((btn) => {
      btn.style.display = "none";
    });

    // 3. Gera o PDF
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        // 4. Restaura a visualização normal após a geração
        document.querySelectorAll(".tab-content").forEach((tab) => {
          tab.classList.remove("pdf-visible");
        });

        // 5. Restaura a visualização do botão "Remover"
        document.querySelectorAll(".remover-exercicio-btn").forEach((btn) => {
          btn.style.display = "block"; // Ou 'inline-block', o que for original
        });

        // 6. Restaura a aba ativa (apenas uma aba deve estar visível no final)
        // Certifique-se de que APENAS a aba ativa volte ao display: block/active
        document.getElementById(
          document.querySelector(".tab-button.active").getAttribute("data-tab")
        ).style.display = "block";
      });
  });

  // ... (restante do seu código) ...
});

document.addEventListener("DOMContentLoaded", () => {
  const gerarBtn = document.getElementById("gerar-planilha-btn");

  gerarBtn.addEventListener("click", () => {
    const conteudo = document.getElementById("planilha-content");
    const aluno = document.getElementById("aluno")?.value || "Aluno";

    // Opções para manter fundo e layout
    const opt = {
      margin: 0.3,
      filename: `Ficha_${aluno}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: null, // mantém o fundo original
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(conteudo).save();
  });
});

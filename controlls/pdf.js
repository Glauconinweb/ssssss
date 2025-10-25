document.addEventListener("DOMContentLoaded", () => {
  const gerarBtn = document.getElementById("gerar-planilha-btn");

  gerarBtn.addEventListener("click", async () => {
    const conteudo = document.getElementById("planilha-content");
    const aluno = document.getElementById("aluno")?.value || "Aluno";

    // Opções do html2pdf
    const opt = {
      margin: 0.3,
      filename: `Ficha_${aluno}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: null, // mantém fundo original
        logging: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      // Gera o PDF como blob primeiro
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(conteudo)
        .outputPdf("blob");

      // Cria link temporário para forçar download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `Ficha_${aluno}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libera memória
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert(
        "Não foi possível gerar o PDF no seu dispositivo. Tente em outro navegador."
      );
    }
  });
});

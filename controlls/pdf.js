document.addEventListener("DOMContentLoaded", () => {
  const gerarBtn = document.getElementById("gerar-planilha-btn");

  gerarBtn.addEventListener("click", async () => {
    const conteudo = document.getElementById("planilha-content");
    const aluno = document.getElementById("aluno")?.value || "Aluno";

    const opt = {
      margin: 0.3,
      filename: `Ficha_${aluno}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(conteudo)
        .outputPdf("blob");

      if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const link = document.createElement("a");
          link.href = event.target.result;
          link.download = `Ficha_${aluno}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        reader.readAsDataURL(pdfBlob);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `Ficha_${aluno}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert(
        "Não foi possível gerar o PDF no seu dispositivo. Tente atualizar o navegador ou usar outro."
      );
    }
  });
});

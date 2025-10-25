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

      const blobUrl = URL.createObjectURL(pdfBlob);
      const ua = navigator.userAgent || "";
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      // detect some common in-app browsers (Facebook, Instagram, WhatsApp, etc.)
      const isInApp =
        /FBAN|FBAV|Instagram|Twitter|Line|WhatsApp|Snapchat/i.test(ua);

      // On iOS and many in-app browsers, download attribute is unreliable.
      if (isIOS || isInApp) {
        // Try to open in new tab/window so the mobile viewer handles saving/sharing
        const win = window.open(blobUrl, "_blank");
        if (!win) {
          // Popup blocked — provide a visible link as fallback
          const fallback = document.createElement("a");
          fallback.href = blobUrl;
          fallback.target = "_blank";
          fallback.textContent =
            "Clique aqui para abrir o PDF. Se nada acontecer, copie o link e abra no navegador.";
          fallback.style.position = "fixed";
          fallback.style.bottom = "20px";
          fallback.style.left = "20px";
          fallback.style.background = "#fff";
          fallback.style.padding = "10px";
          fallback.style.zIndex = 9999;
          document.body.appendChild(fallback);
          // opcional: remover após algum tempo
          setTimeout(() => {
            if (fallback.parentNode) fallback.parentNode.removeChild(fallback);
          }, 15000);
        }
        // revogar depois de um tempo para evitar uso prematuro do objeto
        setTimeout(() => {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch (e) {}
        }, 15000);
      } else {
        // Desktop / Android normal: forçar download via link.download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Ficha_${aluno}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert(
        "Não foi possível gerar o PDF no seu dispositivo. Tente atualizar o navegador ou usar outro. " +
          "Se estiver em um app (WhatsApp/Instagram), abra o link no navegador padrão."
      );
    }
  });
});

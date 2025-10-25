// copie este arquivo para controlls/pdf.js
document.addEventListener("DOMContentLoaded", () => {
  const gerarBtn = document.getElementById("gerar-planilha-btn");
  if (!gerarBtn) return;

  gerarBtn.addEventListener("click", async () => {
    const conteudo = document.getElementById("planilha-content");
    if (!conteudo) {
      alert("Conteúdo da planilha não encontrado.");
      return;
    }

    const aluno =
      (document.getElementById("aluno")?.value || "Aluno").trim() || "Aluno";
    const filename = `Ficha_${aluno}.pdf`;

    const opt = {
      margin: 0.3,
      filename,
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
      const isInApp =
        /FBAN|FBAV|Instagram|Twitter|Line|WhatsApp|Snapchat/i.test(ua);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

      // 1) Web Share API (mobile moderno)
      try {
        const file = new File([pdfBlob], filename, { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: "Ficha em PDF",
          });
          setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
          return;
        }
      } catch (e) {
        console.debug("Web Share falhou ou indisponível:", e);
      }

      // 2) Abrir em nova aba (mais compatível mobile)
      const newWin = window.open(blobUrl, "_blank");
      if (newWin) {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch (e) {}
        }, 15000);
        return;
      }

      // 3) Criar <a target="_blank"> e clicar (sem download attribute no mobile)
      const a = document.createElement("a");
      a.href = blobUrl;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 4) Se nada abriu, navegar para o blob na mesma aba (fallback agressivo)
      setTimeout(() => {
        try {
          window.location.href = blobUrl;
        } catch (e) {
          console.debug(e);
        }

        // 5) Fallback visível: link para o usuário abrir/baixar manualmente
        const fallbackId = "pdf-fallback-link";
        if (!document.getElementById(fallbackId)) {
          const fallback = document.createElement("div");
          fallback.id = fallbackId;
          Object.assign(fallback.style, {
            position: "fixed",
            left: "10px",
            right: "10px",
            bottom: "12px",
            zIndex: 2147483647,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            borderRadius: "6px",
            fontFamily: "sans-serif",
            fontSize: "14px",
          });
          fallback.innerHTML = `
            <div style="margin-bottom:8px;">
              Toque no link abaixo para abrir o PDF. Se estiver dentro de um app (WhatsApp/Instagram), escolha "Abrir no navegador".
            </div>
            <a href="${blobUrl}" target="_blank" style="color:#0066cc; word-break:break-all;">Abrir/baixar Ficha (${filename})</a>
            <div style="margin-top:8px; text-align:right;">
              <button id="fechar-fallback" style="padding:4px 8px;">Fechar</button>
            </div>
          `;
          document.body.appendChild(fallback);
          document
            .getElementById("fechar-fallback")
            .addEventListener("click", () => {
              fallback.remove();
              try {
                URL.revokeObjectURL(blobUrl);
              } catch (e) {}
            });
          // remover automaticamente após 30s
          setTimeout(() => {
            const el = document.getElementById(fallbackId);
            if (el) el.remove();
            try {
              URL.revokeObjectURL(blobUrl);
            } catch (e) {}
          }, 30000);
        }
      }, 500);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert(
        "Não foi possível gerar o PDF no seu dispositivo. Tente atualizar o navegador ou abrir o site no navegador padrão (não em app)."
      );
    }
  });
});

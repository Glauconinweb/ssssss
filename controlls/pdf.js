document.addEventListener("DOMContentLoaded", () => {
  const gerarBtn = document.getElementById("gerar-planilha-btn");

  gerarBtn.addEventListener("click", async () => {
    const conteudo = document.getElementById("planilha-content");
    const aluno = document.getElementById("aluno")?.value || "Aluno";
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

      // 1) Tentar Web Share (mais amigável no mobile moderno)
      try {
        const file = new File([pdfBlob], filename, { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: "Aqui está a ficha em PDF",
          });
          // revogar após um tempo para garantir que o compartilhamento terminou
          setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
          return;
        }
      } catch (e) {
        // falhou no share — continuar com outros fallbacks
        console.debug("Web Share não disponível ou falhou:", e);
      }

      // 2) Tentar abrir em nova aba (geralmente abre visualizador no mobile)
      const newWin = window.open(blobUrl, "_blank");
      if (newWin) {
        // revogar depois para não invalidar enquanto a aba carrega
        setTimeout(() => {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch (err) {}
        }, 15000);
        return;
      }

      // 3) Criar <a target="_blank"> e clicar (sem download attribute)
      const link = document.createElement("a");
      link.href = blobUrl;
      link.target = "_blank";
      // não setar link.download no mobile/iOS — causa problemas
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Verifica se a aba foi aberta; se não, tentar navegar na mesma aba
      // (no mobile alguns navegadores bloqueiam popups mas permitem navegação direta)
      setTimeout(() => {
        // 4) Navegar para o blob (fallback mais agressivo)
        try {
          window.location.href = blobUrl;
        } catch (e) {
          console.debug("window.location href falhou:", e);
        }

        // 5) Criar fallback visível se nada funcionar — link para o usuário tocar/segurar
        const fallbackId = "pdf-fallback-link";
        if (!document.getElementById(fallbackId)) {
          const fallback = document.createElement("div");
          fallback.id = fallbackId;
          fallback.style.position = "fixed";
          fallback.style.left = "10px";
          fallback.style.right = "10px";
          fallback.style.bottom = "12px";
          fallback.style.zIndex = 2147483647;
          fallback.style.background = "#fff";
          fallback.style.border = "1px solid #ccc";
          fallback.style.padding = "10px";
          fallback.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          fallback.style.borderRadius = "6px";
          fallback.innerHTML = `
            <div style="font-size:14px; margin-bottom:8px;">
              Toque no link abaixo para abrir o PDF. Se estiver dentro de um app (WhatsApp/Instagram), escolha "Abrir no navegador".
            </div>
            <a href="${blobUrl}" target="_blank" style="color:#0066cc; word-break:break-all;">Abrir/baixar Ficha (${filename})</a>
            <button id="fechar-fallback" style="margin-left:10px;">Fechar</button>
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
          // remover o fallback automaticamente após 30s
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

# Estúdio Restaura — site institucional

Site do **Estúdio Restaura**, escritório de arquitetura, conservação e restauro de
patrimônio histórico e cultural. Apelo artístico/editorial: tipografia display,
animações de scroll (revelação de texto, lettering, rabisco desenhado, scroll
horizontal travado na seção de destaques).

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Estilo | Tailwind CSS v4 (CSS-first, `@theme` em `src/app/globals.css`) |
| Animação | GSAP + ScrollTrigger |
| Fontes | Archivo (display) + Inter (texto) via `next/font/google` |
| Deploy | Vercel + GitHub (`github.com/ojhondev/estudiorestaura`) |

- Porta de dev: **3011** (config compartilhada em `A:/Velo/.claude/launch.json`).
- **Next.js 16**: leia `node_modules/next/dist/docs/` antes de mexer em APIs do framework.
- Layout **fluido / full-width**: o conteúdo ocupa toda a largura da tela, com
  respiro lateral via `.shell` (padding em `clamp`), sem container centralizado
  de largura máxima.
- Imagens ainda não existem: usar o componente `ImagePlaceholder`
  ("ESPAÇO PARA IMAGEM"). Trocar por imagens reais depois sem mudar o layout.
- Formulário de contato é **mockado** (`/api/contato` valida e responde ok, sem
  banco/e-mail). Trocar pela integração real depois.

## Git: commit, push e deploy automáticos

Toda alteração de código feita neste projeto (nesta ou em sessões futuras) deve ser
commitada, enviada para o GitHub (`origin/main`) e publicada em produção
automaticamente, sem esperar autorização explícita a cada vez — isso já foi
autorizado pelo usuário.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar `npm run build` (typecheck/lint) normalmente.
2. `git add -A`
3. `git commit -m "<mensagem no imperativo descrevendo a mudança>"`
4. `git push origin main`
5. `npx vercel@latest --prod` — obrigatório, não presumir que o push sozinho
   publica (o auto-deploy nativo da Vercel já falhou silenciosamente antes).

Mensagens de commit em português, no imperativo, descrevendo o comportamento —
não o código. Rebrand/copy em commits separados de schema/lógica.

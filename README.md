# ApontamentoPWA — versão inicial 0.1.0

Aplicativo de campo para a equipe SISTEMA. Projeto independente: o gerador Windows e o banco FBS não foram modificados.

## Testar no computador

Abra http://localhost:4173 enquanto o servidor de teste estiver em execução. Para iniciar outra sessão, execute `Iniciar-Teste.cmd`, ou abra um terminal nesta pasta e execute `node server.mjs` (Node 20 ou posterior). O servidor fica restrito ao próprio computador; encerre com Ctrl+C no terminal.

O aplicativo abre vazio. Os dados das verificações ficam em perfis de navegador isolados, sem preencher o aplicativo do usuário com exemplos.

## O que está disponível

- Inclusão, edição e exclusão de apontamentos: OP, entrada, saída, atividade e descrição opcional.
- 18 atividades do grupo SISTEMA, consultadas do banco fornecido, sem alteração, em 10/11/2026. Os nomes originais, inclusive a grafia do cadastro, foram preservados.
- Armazenamento IndexedDB e aplicativo em cache para funcionamento offline após a primeira abertura online.
- Validação de horários, datas reais, saída posterior à entrada, mesmo dia, sobreposição entre OPs e descrição de até 4.000 caracteres Unicode.
- Lista por dia, filtros por OP e período, resumo de tempo e quantidade.
- Excel `.xlsx` padrão, com os registros de todas as OPs ou apenas da seleção; download e compartilhamento quando suportado pelo navegador.
- Backup JSON completo e restauração em uma transação: registros idênticos são ignorados e conflitos bloqueiam toda a importação, sem substituições silenciosas.
- Interface para celular e computador, orientação de instalação e solicitação de armazenamento persistente.

O aplicativo coleta dados de campo. Não gera PDF, não acessa o banco FBS, não valida a existência da OP, não grava no FBS e não sincroniza aparelhos automaticamente. Os vínculos devem ser conferidos pelo gerador Windows com um banco atualizado. O catálogo é do grupo SISTEMA, mas isso não é autenticação de usuários.

## Instalar no celular

É necessário publicar a pasta `public` em um servidor **HTTPS com certificado confiável**. Uma pasta compartilhada ou `http://192.168...` não habilita o service worker no celular. A exceção de desenvolvimento `http://localhost` vale para o dispositivo que executa o servidor, não para outro celular na rede.

Opção recomendada para testes: hospedagem estática com HTTPS. O servidor recebe os arquivos do aplicativo, não os apontamentos. Alternativa interna: a TI pode hospedar os mesmos arquivos em IIS/Nginx/Apache, com nome DNS e certificado HTTPS reconhecido pelos aparelhos. Um servidor interno exige acesso à rede da empresa na primeira instalação e nas atualizações.

1. Publicar o **conteúdo** de `public` no endereço escolhido; pode ser a raiz ou uma subpasta.
2. Abrir o endereço no celular conectado. No iPhone, usar Safari → Compartilhar → Adicionar à Tela de Início. No Android, usar a opção de instalação oferecida pelo navegador.
3. Abrir pelo ícone instalado e aguardar **Pronto para usar offline** antes de registrar informações reais. Safari e o aplicativo instalado podem manter dados separados.
4. Ativar modo avião, fechar e reabrir pelo ícone, incluir e editar um registro.
5. Voltar à conexão, exportar Excel e importar no gerador Windows. Exportação e gravação local também funcionam offline; enviar o arquivo à nuvem depende de conexão e do aplicativo escolhido.

Os registros pertencem ao aparelho, navegador e endereço usado. Trocar domínio/protocolo, limpar dados do navegador ou remover o aplicativo pode torná-los indisponíveis. Exporte backups regularmente. Armazenamento persistente depende da autorização e política do navegador; não substitui backup.

## Publicação e atualização

O pacote `ApontamentoPWA-publicacao-v0.1.0.zip` contém somente os arquivos públicos necessários. Não contém banco FBS, cadastros de clientes, OPs da empresa nem dados dos testes.

- Servir `.js` como JavaScript, `.webmanifest` como `application/manifest+json` e `.png` como imagem.
- Manter `sw.js`, HTML e manifesto com revalidação (`Cache-Control: no-cache`). Não usar cache permanente para `sw.js`.
- Publicar todos os arquivos juntos. Não renomear apenas um módulo sem atualizar suas referências e a lista `ASSETS` do service worker.
- Ao publicar alterações, mudar o sufixo da versão do cache em `public/sw.js`. A atualização é oferecida ao usuário; não recarrega o editor silenciosamente. O cache de arquivos é separado do IndexedDB.
- Manter o mesmo endereço e o banco IndexedDB. Mudanças no esquema precisam de migração explícita.

Nenhum serviço pago, conta externa ou publicação foi criado automaticamente.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `public/index.html` | Telas, campos e textos estáticos |
| `public/styles.css` | Cores e organização responsiva |
| `public/app.js` | Fluxos da interface, instalação e exportação |
| `public/domain.js` | Validação de registros, filtros e restauração |
| `public/db.js` | IndexedDB e transações de gravação |
| `public/activities.js` | Catálogo local do grupo SISTEMA |
| `public/xlsx.js` | Exportador Excel/ZIP sem dependências de rede |
| `public/sw.js` | Cache offline e atualização do aplicativo |
| `public/manifest.webmanifest` | Identidade e instalação PWA |
| `server.mjs` | Servidor local de desenvolvimento |
| `tests` | Regras, navegador e compatibilidade Windows |

Não é necessário compilar ou executar npm para publicar: a aplicação é HTML, CSS e JavaScript modular, sem CDN ou bibliotecas externas em tempo de execução. O exportador Excel gera OOXML e ZIP padrão e foi validado com o importador C# existente.

## Testes

- `node --test tests/domain.test.mjs`: regras de data, atividade, OP, horários, Unicode, filtros e backups.
- `node tests/browser.cjs`: requer Playwright disponível e Microsoft Edge instalado; o servidor local deve estar em execução. Usa um perfil isolado e arquivos em `artifacts`.
- `dotnet run --project tests/WindowsImport -- artifacts/exported.xlsx`: requer .NET 10 e o projeto Windows vizinho; compila o importador real sem modificá-lo, valida OpenXML e compara o conteúdo.

O teste de navegador simula dimensões móveis e rede offline. Não substitui a validação no Safari/iOS e Chrome/Android reais, principalmente instalação, compartilhamento e preservação dos dados após reiniciar o aparelho.

Referências técnicas: [service workers e HTTPS](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [armazenamento no WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/), [dados separados no aplicativo instalado](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/).

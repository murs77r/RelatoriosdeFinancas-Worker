addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
  
    if (url.search.length === 0) {
      return new Response("Uso inadequado. Tente novamente pelo aplicativo.", {
        status: 500
      });
    }
  
  
    if (url.search.startsWith("?=") && !String(url).includes("?=gabriel")) {
      const base64String = url.search.substring(2);
      try {
        const binaryString = atob(base64String.replace(/-/g, "+").replace(/_/g, "/"));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        url.search = "?" + new TextDecoder("utf-8").decode(bytes);
      } catch {
        return new Response("Os parâmetros em base64 são inválidos.", { status: 400 });
      }
    }
  
  
  
    if (String(url).includes('?=gabriel')) {
      return renderGabrielPage();
    }
  
    const params = url.searchParams;
  
    let verificacao;
    if (String(url).includes('tipo=Cart%C3%A3o+de+Cr%C3%A9dito&operador=Gabriel+Souza+Ramos') || String(url).includes('tipo=Cartão de Crédito&operador=Gabriel Souza Ramos')) {
      verificacao = "VERIFICADO";
    }
  
    let tempo = params.get('tempo');
    let tipo = params.get('tipo');
    let operador = params.get('operador');
    let datainicial = params.get('datainicial');
    let datafinal = params.get('datafinal');
    let cartaoCredito = params.get('cartaoCredito');
    let contaFinanceira = params.get('contaFinanceira');
    let descricao = params.get('descricao');
    let procedimentoSaldo = params.get('procedimentoSaldo');
    let procedimentoCartao = params.get('procedimentoCartao');
    let idRecorrencia = params.get('idRecorrencia');
    let categoria = params.get('categoria');
    let status = params.get('status');
    let relevanteImpostoRenda = params.get('relevanteImpostoRenda');
    let operacaoSaldo = params.get('operacaoSaldo');
    let lancamentocartao = params.get('lancamentocartao');
    let parcelamento = params.get('parcelamento');
    let qtdeparcelas = params.get('qtdeparcelas');
    let filtros = params.get('filtros');
    let recomendacoes = params.get('recomendacoes');
    let insightgerado = params.get('insightgerado');
    let htmlgerado = params.get('htmlgerado');
  
    if (htmlgerado) {
      return renderhtml(htmlgerado);
    }
  
    return processRequest(url, tempo, tipo, operador, datainicial, datafinal, cartaoCredito, contaFinanceira, descricao, procedimentoSaldo, procedimentoCartao, idRecorrencia, categoria, status, relevanteImpostoRenda, operacaoSaldo, lancamentocartao, verificacao, filtros, parcelamento, qtdeparcelas, recomendacoes, insightgerado);
  }
  
  async function processRequest(url, tempo, tipo, operador, datainicial, datafinal, cartaoCredito, contaFinanceira, descricao, procedimentoSaldo, procedimentoCartao, idRecorrencia, categoria, status, relevanteImpostoRenda, operacaoSaldo, lancamentocartao, verificacao, filtros, parcelamento, qtdeparcelas, recomendacoes, insightgerado) {
    if (url.searchParams.get('senha') !== `${SENHA}` && !verificacao) {
      return new Response("Insira a variável de ambiente de autenticação adequada.", {
        status: 400
      });
    }
  
    const gasUrl = URL_GAS;
    const gasParams = new URLSearchParams({
      tempo: tempo || '',
      tipo: tipo || '',
      operador: operador || '',
      datainicial: datainicial ? String(datainicial).replace(/-/g, '/').trim() : '' || '',
      datafinal: datafinal ? String(datafinal).replace(/-/g, '/').trim() : '' || '',
      cartaoCredito: cartaoCredito || '',
      contaFinanceira: contaFinanceira || '',
      descricao: descricao || '',
      procedimentoSaldo: procedimentoSaldo || '',
      procedimentoCartao: procedimentoCartao || '',
      idRecorrencia: idRecorrencia || '',
      categoria: categoria || '',
      status: status || '',
      relevanteImpostoRenda: relevanteImpostoRenda || '',
      operacaoSaldo: operacaoSaldo || '',
      lancamentocartao: lancamentocartao ? String(lancamentocartao).replace(/-/g, '/').trim() : '' || '',
      filtros: filtros || 'Mostrar',
      parcelamento: parcelamento || '',
      qtdeparcelas: qtdeparcelas || '',
      recomendacoes: recomendacoes || '',
      insightgerado: insightgerado || '',
      token: CRYPTO_KEY
    });
  
    const loadingHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Carregando...</title>
      <link rel="icon" type="image/png" href="https://i.ibb.co/MMdSHDp/financa.png">
      <style>
        html, body {
            height: 100%;
            margin: 0;
        }
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
        body {
          font-family: 'Roboto Condensed', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #121212;
          font-family: sans-serif;
          margin: 0px;
        }
        .loader {
          border: 8px solid #474747;
          border-top: 8px solid #1d1d1d;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            color: white;
            font-family: sans-serif;
            padding: 20px;
            text-align: center;
        }
  
        .error-container h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
  
        .error-container p {
            font-size: 1.2em;
            max-width: 600px;
            line-height: 1.5;
        }
  
        @media (max-width: 768px) {
            .error-container h1 {
                font-size: 2em;
            }
            .error-container p {
                font-size: 1em;
            }
        }
  
        body:has(.error-container) {
          background-color: #8b0000;
        }
      </style>
    </head>
    <body>
      <div class="loader"></div>
      <script>
        async function fetchData() {
          const gasUrl = '${gasUrl}?${gasParams.toString()}';
          try {
            const response = await fetch(gasUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });
  
            if (response.ok) {
              const newHTML = await response.text();
              if (newHTML.trim() === '') {
                  throw new Error("API returned an empty response.");
              }
  
              if (newHTML.trim() === "ACESSO NÃO PERMITIDO.") { 
                  window.location.reload();
                  return; 
              }
  
              if (newHTML.startsWith("MENSAGEM DE ERRO:")) {
                  throw new Error(newHTML);
              }
  
              const newDocument = document.implementation.createHTMLDocument();
              newDocument.documentElement.innerHTML = newHTML;
              document.head.replaceWith(newDocument.head);
              document.body.replaceWith(newDocument.body);
            } else {
              throw new Error(\`API request failed with status: \${response.status}\`);
            }
          } catch (error) {
            document.body.innerHTML = \`
              <div class="error-container">
                <h1>ERRO AO CARREGAR OS DADOS!</h1>
                <p>Não foi possível obter os dados da API.  Por favor, contate o desenvolvedor.</p>
                <p>Detalhes do erro: \${error.message}</p>
              </div>
            \`;
          }
        }
  
        fetchData();
      </script>
    </body>
    </html>
    `;
  
    return new Response(loadingHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
  
  function renderhtml(htmlgerado) {
    return new Response(htmlgerado, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
    });
  }
  
  function renderGabrielPage() {
    const html = `
    <!DOCTYPE html>
  <html>
  <head>
  <title>Registros de Transações</title>
  <link rel="icon" type="image/png" href="https://i.ibb.co/MMdSHDp/financa.png">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
  
    body {
      font-family: 'Roboto Condensed', sans-serif;
      background-color: #121212;
      color: #fff;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-size: 16px;
    }
  
    .container {
      width: 90%;
      max-width: 800px;
      padding: 40px 20px;
      border-radius: 8px;
    }
  
    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
    }
  
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
  
    .filter-button {
      flex: 1;
      min-width: 120px;
      padding: 10px;
      background-color: #4CAF50;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s;
      font-family: 'Roboto Condensed', sans-serif;
    }
  
    .filter-button:hover {
      background-color: #66bb6a;
    }
  
    .filter-section {
      margin-bottom: 0px;
    }
  
    .filter-section h2 {
      font-size: 1.4em;
      margin-bottom: 10px;
      border-bottom: 1px solid #444;
      padding-bottom: 5px;
    }
  
    label {
      display: block;
      margin-bottom: 10px;
    }
  
    input[type="date"],
    select,
    input[type="number"],
      input[type="text"]{
      width: 100%;
      height: 45px;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #444;
      background-color: #282828;
      color: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      font-family: 'Roboto Condensed', sans-serif;
      font-size: 1em;
    }
  
    .filter-section button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s;
      font-family: 'Roboto Condensed', sans-serif;
    }
  
      .filter-section .filterspc-button-container button{
          width: 100%;
          height: 45px;
      }
      .filter-section .filterspc-button-container select{
          width: 100%;
          margin-bottom: 0px;
      }
  
        .filter-section .filterspc-button-container input[type="text"]{
          width: 100%;
          margin-bottom: 0px;
      }
  
    .filter-section button:hover {
      background-color: #66bb6a;
    }
  
    .hidden {
      display: none;
    }
  
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
  
    .modal-content {
      background-color: #1e1e1e;
      margin: 15% auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
      width: 80%;
      max-width: 500px;
    }
  
    .close-button {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
  
    .filtrar {
      background-color: #fff!important;
      color: #000!important;
    }
  
    .filtrar:hover {
      background-color: #e0e0e0!important;
    }
  
    .filtrar:focus {
      background-color: #000!important;
      color: #fff!important;
    }
  
    .close-button:hover,
    .close-button:focus {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    .modal-message {
        color: white;
        font-size: 1.1em;
    }
  
      .filterspc-button-container {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 10px;
      }
  
    @media (max-width: 768px) {
      body {
        padding: 0px;
        font-size: 14px;
      }
      .container {
        min-height: 100vh;
      }
      .filter-buttons {
        flex-direction: column;
      }
      .filter-button{
        width: 100%;
      }
      .modal-content {
        margin: 30% auto;
        width: 90%;
      }
  
        .filterspc-button-container {
            flex-direction: column;
            gap: 5px;
        }
  
        .filter-section .filterspc-button-container button{
          width: 100%;
      }
    }
  </style>
  </head>
  <body onload="preencherDataAtual()">
  <div class="container">
    <h1 style="margin-bottom: 0px; margin-top: 0px;">HISTÓRICO DE TRANSAÇÕES</h1>
    <h1 style="margin-bottom: 40px; margin-top: 0px; font-size: 0.8rem">DE GABRIEL</h1>
  
    <div class="filter-buttons">
      <button class="filter-button" id="date-filter-button" onclick="toggleSection('date-filter')">📅 Filtrar por datas</button>
      <button class="filter-button" id="launch-filter-button" onclick="toggleSection('launch-filter')">📊 Filtrar por lançamento</button>
    </div>
  
    <div id="date-filter" class="filter-section">
      <h2>FILTRO POR DATAS</h2>
      <label for="datainicial">Data Inicial:</label>
      <input type="date" id="datainicial" name="datainicial">
      <label for="datafinal">Data Final:</label>
      <input type="date" id="datafinal" name="datafinal">
    </div>
  
      <div id="launch-filter" class="filter-section hidden">
      <h2>FILTRO POR LANÇAMENTO</h2>
      <label for="mesLancamento">Mês de Lançamento:</label>
      <select id="mesLancamento" name="mesLancamento">
        <option value="" disabled selected>Selecione o Mês</option>
        <option value="Janeiro">Janeiro</option>
        <option value="Fevereiro">Fevereiro</option>
        <option value="Março">Março</option>
        <option value="Abril">Abril</option>
        <option value="Maio">Maio</option>
        <option value="Junho">Junho</option>
        <option value="Julho">Julho</option>
        <option value="Agosto">Agosto</option>
        <option value="Setembro">Setembro</option>
        <option value="Outubro">Outubro</option>
        <option value="Novembro">Novembro</option>
        <option value="Dezembro">Dezembro</option>
      </select>
      <label for="anoLancamento">Ano de Lançamento:</label>
      <input type="number" id="anoLancamento" name="anoLancamento">
    </div>
  
      <div id="common-filters" class="filter-section">
        <label for="outrasopcoes">Outras Opções:</label>
      <div style="margin-bottom: 17.5px">
        <div class="filterspc-button-container">
            <button id="categoriabutton" onclick="toggleSelect('categoriabutton', 'categoria', 'categoria_real', 'Selecione a Categoria')" style="background-color: #8b0000; color: #fff;">Categoria</button>
            <select id="categoria" name="categoria" disabled style="display: none;">
              <option value="" disabled selected>Filtro desativado</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Compras">Compras</option>
              <option value="Dívidas">Dívidas</option>
              <option value="Doações">Doações</option>
              <option value="Educação">Educação</option>
              <option value="Lazer">Lazer</option>
              <option value="Moradia">Moradia</option>
              <option value="Presentes">Presentes</option>
              <option value="Prestação de Serviços">Prestação de Serviços</option>
              <option value="Saúde">Saúde</option>
              <option value="Seguros">Seguros</option>
              <option value="Serviços Bancários">Serviços Bancários</option>
              <option value="Transporte">Transporte</option>
              <option value="Outros Tipos">Outros Tipos</option>
            </select>
        </div>
        <input type="hidden" id="categoria_real" name="categoria_real" value="">
        <div class="filterspc-button-container">
            <button id="cartaobutton" onclick="toggleSelect('cartaobutton', 'cartao', 'cartao_real', 'Selecione o Cartão de Crédito')" style="background-color: #8b0000; color: #fff;">Cartão de Crédito</button>
            <select id="cartao" name="cartao" disabled style="display: none;">
              <option value="" disabled selected>Filtro desativado</option>
              <option value="Will Bank - Mastercard Internacional">Will Bank - Mastercard Internacional</option>
              <option value="Nubank - Mastercard Platinum">Nubank - Mastercard Platinum</option>
            </select>
        </div>
        <input type="hidden" id="cartao_real" name="cartao_real" value="">
        <div class="filterspc-button-container">
            <button id="descricaobutton" onclick="toggleInput('descricaobutton', 'descricao', 'descricao_real')" style="background-color: #8b0000; color: #fff;">Descrição do Gasto</button>
            <input id="descricao" name="descricao" type="text" placeholder="Digite a descrição..." disabled style="display: none;"></input>
        </div>
        <input type="hidden" id="descricao_real" name="descricao_real" value="">
      </div>
      <button onclick="filterData()" class="filtrar">Filtrar</button>
    </div>
  
  
  </div>
  
  <div id="myModal" class="modal">
    <div class="modal-content">
      <span class="close-button">×</span>
      <p class="modal-message"></p>
    </div>
  </div>
  
  <script>
    function preencherDataAtual() {
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const hoje = new Date();
        const mesAtual = meses[hoje.getMonth()];
        const anoAtual = hoje.getFullYear();
  
        document.getElementById('mesLancamento').value = mesAtual;
        document.getElementById('anoLancamento').value = anoAtual;
    }
  
      function limparCampos() {
        document.getElementById('datainicial').value = '';
        document.getElementById('datafinal').value = '';
        preencherDataAtual();
        document.getElementById('categoria_real').value = '';
        document.getElementById('cartao_real').value = '';
        document.getElementById('descricao_real').value = '';
  
        const categoriaSelect = document.getElementById('categoria');
          if (categoriaSelect) {
              categoriaSelect.value = '';
              categoriaSelect.disabled = true;
              categoriaSelect.style.display = 'none';
          }
          const categoriaButton = document.getElementById('categoriabutton');
          if(categoriaButton){
              categoriaButton.style.backgroundColor = '#8b0000';
              categoriaButton.style.color = '#fff';
          }
  
          const cartaoSelect = document.getElementById('cartao');
  
          if (cartaoSelect) {
              cartaoSelect.value = '';
              cartaoSelect.disabled = true;
              cartaoSelect.style.display = 'none';
          }
  
          const cartaoButton = document.getElementById('cartaobutton');
          if(cartaoButton){
              cartaoButton.style.backgroundColor = '#8b0000';
              cartaoButton.style.color = '#fff';
          }
  
          const descricaoInput = document.getElementById('descricao');
          if(descricaoInput){
              descricaoInput.value = '';
              descricaoInput.disabled = true;
              descricaoInput.style.display = 'none';
          }
          const descricaoButton = document.getElementById('descricaobutton');
          if(descricaoButton){
              descricaoButton.style.backgroundColor = '#8b0000';
              descricaoButton.style.color = '#fff';
          }
    }
  
      function toggleInput(buttonId, inputId, hiddenInputId) {
          const button = document.getElementById(buttonId);
          const input = document.getElementById(inputId);
          const hiddenInput = document.getElementById(hiddenInputId);
  
          if (!button || !input || !hiddenInput) {
              showModal("Elementos não encontrados. Verifique os IDs.");
              return;
          }
  
          if (input.disabled) {
              input.disabled = false;
              input.style.display = "";
              button.style.backgroundColor = '#3498db';
              button.style.color = '#fff';
              button.dataset.ativo = 'true';
          } else {
              input.disabled = true;
              input.style.display = "none";
              input.value = "";
              hiddenInput.value = "";
              button.style.backgroundColor = '#8b0000';
              button.style.color = '#fff';
              button.dataset.ativo = 'false';
          }
        hiddenInput.value = input.value;
        input.addEventListener('input', () => {
          hiddenInput.value = input.value;
        })
      }
  
  
      function toggleSelect(buttonId, selectId, hiddenInputId, texto) {
          const button = document.getElementById(buttonId);
          const select = document.getElementById(selectId);
          const hiddenInput = document.getElementById(hiddenInputId);
  
          if (!button || !select || !hiddenInput) {
              showModal("Elementos não encontrados. Verifique os IDs.");
              return;
          }
  
          function updateHiddenInputValue() {
              hiddenInput.value = select.value;
          }
  
          const placeholderOption = select.querySelector('option[value=""]');
  
          if (select.disabled) {
              select.disabled = false;
              select.style.display = "";
              select.removeAttribute('data-placeholder');
              placeholderOption.textContent = texto;
              select.atualizaCampoOculto = updateHiddenInputValue.bind(select);
              select.addEventListener('change', select.atualizaCampoOculto);
              hiddenInput.value = select.value;
              button.style.backgroundColor = '#3498db';
              button.style.color = '#fff';
              button.dataset.ativo = 'true';
  
          } else {
              select.disabled = true;
              select.style.display = "none";
              select.setAttribute('data-placeholder', 'Filtro desativado');
              placeholderOption.textContent = select.dataset.placeholder;
              select.value = "";
              hiddenInput.value = "";
              select.removeEventListener('change', select.atualizaCampoOculto);
              delete select.atualizaCampoOculto;
              button.style.backgroundColor = '#8b0000';
              button.style.color = '#fff';
              button.dataset.ativo = 'false';
          }
      }
  
      function showModal(message) {
          const modal = document.getElementById('myModal');
          const modalMessage = document.querySelector('.modal-message');
          modalMessage.textContent = message;
          modal.style.display = 'block';
  
          const closeButton = document.querySelector('.close-button');
          closeButton.onclick = function () {
              modal.style.display = 'none';
          }
  
          window.onclick = function (event) {
              if (event.target == modal) {
                  modal.style.display = 'none';
              }
          }
      }
  
    let currentFilter = 'date-filter';
  
  function toggleSection(sectionId) {
      const dateFilter = document.getElementById('date-filter');
      const launchFilter = document.getElementById('launch-filter');
      const commonFilters = document.getElementById('common-filters');
  
      if (currentFilter === sectionId) {
          return;
      }
  
      if (sectionId === 'date-filter') {
          dateFilter.classList.remove('hidden');
          launchFilter.classList.add('hidden');
          commonFilters.classList.remove('hidden');
          currentFilter = 'date-filter';
      } else if (sectionId === 'launch-filter') {
          launchFilter.classList.remove('hidden');
          dateFilter.classList.add('hidden');
          commonFilters.classList.remove('hidden');
          currentFilter = 'launch-filter';
      }
  }
  
      function filterData() {
          if (currentFilter === 'date-filter') {
              filterByDate();
          } else if (currentFilter === 'launch-filter') {
              filterByLaunch();
          }
      }
  
      function filterByDate() {
          const datainicial = document.getElementById('datainicial').value;
          const datafinal = document.getElementById('datafinal').value;
          const categoriadata = document.getElementById('categoria_real').value;
          const cartaodata = document.getElementById('cartao_real').value;
          const descricaodata = document.getElementById('descricao_real').value;
  
          if (!datainicial || !datafinal) {
              showModal('Preencha as duas datas.');
              return;
          }
  
          const dateInicialObj = new Date(datainicial);
          const dateFinalObj = new Date(datafinal);
  
  
          if (dateInicialObj > dateFinalObj) {
              showModal("A data inicial não pode ser maior que a data final.");
              return;
          }
  
          function formatDate(dateString) {
              const date = new Date(dateString + 'T00:00:00');
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return day + "-" + month + "-" + year;
          }
  
          const formattedDatainicial = formatDate(datainicial);
          const formattedDatafinal = formatDate(datafinal);
  
          const params = new URLSearchParams();
          params.append('tipo', 'Cartão de Crédito');
          params.append('operador', 'Gabriel Souza Ramos');
          params.append('datainicial', formattedDatainicial);
          params.append('datafinal', formattedDatafinal);
          params.append('filtros', 'Não mostrar');
          params.append('status', 'Efetuado');
  
          if (categoriadata) {
              params.append('categoria', categoriadata);
          }
  
          if (cartaodata) {
              params.append('cartaoCredito', cartaodata);
          }
  
          if (descricaodata) {
              params.append('descricao', descricaodata);
          }
  
          const encodedParams = btoa(params.toString());
          window.location.href = '?=' + encodedParams;
      }
  
      function filterByLaunch() {
          const mesLancamento = document.getElementById('mesLancamento').value;
          const anoLancamento = document.getElementById('anoLancamento').value;
          const categorialancamento = document.getElementById('categoria_real').value;
          const cartaolancamento = document.getElementById('cartao_real').value;
          const descricaolancamento = document.getElementById('descricao_real').value;
  
          if (!mesLancamento) {
              showModal("Selecione um mês de lançamento.");
              return;
          }
  
          if (!anoLancamento || isNaN(parseInt(anoLancamento)) || parseInt(anoLancamento) < 2024 || parseInt(anoLancamento) > 9999) {
              showModal('O ano de lançamento deve ser um número entre 2024 e 9999.');
              return;
          }
  
          const lancamentocartao = mesLancamento + '-' + anoLancamento;
          const params = new URLSearchParams();
          params.append('tempo', 'Tudo');
          params.append('tipo', 'Cartão de Crédito');
          params.append('operador', 'Gabriel Souza Ramos');
          params.append('lancamentocartao', lancamentocartao);
          params.append('filtros', 'Não mostrar');
          params.append('status', 'Efetuado');
  
          if (categorialancamento) {
              params.append('categoria', categorialancamento);
          }
  
          if (cartaolancamento) {
              params.append('cartaoCredito', cartaolancamento);
          }
  
          if (descricaolancamento) {
              params.append('descricao', descricaolancamento);
          }
  
          const encodedParams = btoa(params.toString());
          window.location.href = '?=' + encodedParams;
      }
  </script>
  </body>
  </html>
  `;
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
    });
  }
  
  function renderPage() {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Registros de Transações</title>
    <link rel="icon" type="image/png" href="https://i.ibb.co/MMdSHDp/financa.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
  
      body {
        font-family: 'Roboto Condensed', sans-serif;
        background-color: #121212;
        color: #fff;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-size: 16px;
      }
  
      .container {
        width: 90%;
        max-width: 800px;
        padding: 40px 20px;
        border-radius: 8px;
      }
  
      h1 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.2em;
      }
  
      .filter-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
  
      .filter-button {
        flex: 1;
        min-width: 120px;
        padding: 10px;
        background-color: #4CAF50;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;
        transition: background-color 0.3s;
        font-family: 'Roboto Condensed', sans-serif;
      }
  
      .filter-button:hover {
        background-color: #66bb6a;
      }
  
      .filter-section {
        margin-bottom: 0px;
      }
  
      .filter-section h2 {
        font-size: 1.4em;
        margin-bottom: 10px;
        border-bottom: 1px solid #444;
        padding-bottom: 5px;
      }
  
      label {
        display: block;
        margin-bottom: 10px;
      }
  
      input[type="date"],
      select,
      input[type="number"],
        input[type="text"]{
        width: 100%;
        height: 45px;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #444;
        background-color: #282828;
        color: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1em;
      }
  
      .filter-section button {
        width: 100%;
        padding: 10px;
        background-color: #4CAF50;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;
        transition: background-color 0.3s;
        font-family: 'Roboto Condensed', sans-serif;
      }
  
        .filter-section .filterspc-button-container button{
            width: 100%;
            height: 45px;
        }
        .filter-section .filterspc-button-container select{
            width: 100%;
            margin-bottom: 0px;
        }
  
          .filter-section .filterspc-button-container input[type="text"]{
            width: 100%;
            margin-bottom: 0px;
        }
  
      .filter-section button:hover {
        background-color: #66bb6a;
      }
  
      .hidden {
        display: none;
      }
  
      .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
      }
  
      .modal-content {
        background-color: #1e1e1e;
        margin: 15% auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        width: 80%;
        max-width: 500px;
      }
  
      .close-button {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }
  
      .filtrar {
        background-color: #fff!important;
        color: #000!important;
      }
  
      .filtrar:hover {
        background-color: #e0e0e0!important;
      }
  
      .filtrar:focus {
        background-color: #000!important;
        color: #fff!important;
      }
  
      .close-button:hover,
      .close-button:focus {
        color: white;
        text-decoration: none;
        cursor: pointer;
      }
      .modal-message {
          color: white;
          font-size: 1.1em;
      }
  
        .filterspc-button-container {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
        }
  
      @media (max-width: 768px) {
        body {
          padding: 0px;
          font-size: 14px;
        }
        .container {
          min-height: 100vh;
        }
        .filter-buttons {
          flex-direction: column;
        }
        .filter-button{
          width: 100%;
        }
        .modal-content {
          margin: 30% auto;
          width: 90%;
        }
  
          .filterspc-button-container {
              flex-direction: column;
              gap: 5px;
          }
  
          .filter-section .filterspc-button-container button{
            width: 100%;
        }
      }
    </style>
    </head>
    <body onload="limparCampos()">
    <div class="container">
      <h1 style="margin-bottom: 0px; margin-top: 0px;">HISTÓRICO DE TRANSAÇÕES</h1>
      <h1 style="margin-bottom: 40px; font-size:0.8rem; line-height: 10px;">DE GABRIEL SOUZA RAMOS</b></h1>
  
      <div class="filter-buttons">
        <button class="filter-button" id="date-filter-button" onclick="toggleSection('date-filter')">📅 Filtrar por datas</button>
        <button class="filter-button" id="launch-filter-button" onclick="toggleSection('launch-filter')">📊 Filtrar por lançamento</button>
      </div>
  
      <div id="date-filter" class="filter-section">
        <h2>FILTRO POR DATAS</h2>
        <label for="datainicial">Data Inicial:</label>
        <input type="date" id="datainicial" name="datainicial">
        <label for="datafinal">Data Final:</label>
        <input type="date" id="datafinal" name="datafinal">
      </div>
  
        <div id="launch-filter" class="filter-section hidden">
        <h2>FILTRO POR LANÇAMENTO</h2>
        <label for="mesLancamento">Mês de Lançamento:</label>
        <select id="mesLancamento" name="mesLancamento">
          <option value="" disabled selected>Selecione o Mês</option>
          <option value="Janeiro">Janeiro</option>
          <option value="Fevereiro">Fevereiro</option>
          <option value="Março">Março</option>
          <option value="Abril">Abril</option>
          <option value="Maio">Maio</option>
          <option value="Junho">Junho</option>
          <option value="Julho">Julho</option>
          <option value="Agosto">Agosto</option>
          <option value="Setembro">Setembro</option>
          <option value="Outubro">Outubro</option>
          <option value="Novembro">Novembro</option>
          <option value="Dezembro">Dezembro</option>
        </select>
        <label for="anoLancamento">Ano de Lançamento:</label>
        <input type="number" id="anoLancamento" name="anoLancamento">
      </div>
  
        <div id="common-filters" class="filter-section">
          <label for="outrasopcoes">Outras Opções:</label>
        <div style="margin-bottom: 17.5px">
          <div class="filterspc-button-container">
              <button id="categoriabutton" onclick="toggleSelect('categoriabutton', 'categoria', 'categoria_real', 'Selecione a Categoria')" style="background-color: #8b0000; color: #fff;">Categoria</button>
              <select id="categoria" name="categoria" disabled style="display: none;">
                <option value="" disabled selected>Filtro desativado</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Compras">Compras</option>
                <option value="Dívidas">Dívidas</option>
                <option value="Doações">Doações</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
                <option value="Moradia">Moradia</option>
                <option value="Presentes">Presentes</option>
                <option value="Prestação de Serviços">Prestação de Serviços</option>
                <option value="Saúde">Saúde</option>
                <option value="Seguros">Seguros</option>
                <option value="Serviços Bancários">Serviços Bancários</option>
                <option value="Transporte">Transporte</option>
                <option value="Outros Tipos">Outros Tipos</option>
              </select>
          </div>
          <input type="hidden" id="categoria_real" name="categoria_real" value="">
          <div class="filterspc-button-container">
              <button id="cartaobutton" onclick="toggleSelect('cartaobutton', 'cartao', 'cartao_real', 'Selecione o Cartão de Crédito')" style="background-color: #8b0000; color: #fff;">Cartão de Crédito</button>
              <select id="cartao" name="cartao" disabled style="display: none;">
                <option value="" disabled selected>Filtro desativado</option>
                <option value="Will Bank - Mastercard Internacional">Will Bank - Mastercard Internacional</option>
                <option value="Nubank - Mastercard Platinum">Nubank - Mastercard Platinum</option>
              </select>
          </div>
          <input type="hidden" id="cartao_real" name="cartao_real" value="">
          <div class="filterspc-button-container">
              <button id="descricaobutton" onclick="toggleInput('descricaobutton', 'descricao', 'descricao_real')" style="background-color: #8b0000; color: #fff;">Descrição do Gasto</button>
              <input id="descricao" name="descricao" type="text" placeholder="Digite a descrição..." disabled style="display: none;"></input>
          </div>
          <input type="hidden" id="descricao_real" name="descricao_real" value="">
        </div>
        <button onclick="filterData()" class="filtrar">Filtrar</button>
      </div>
  
  
    </div>
  
    <div id="myModal" class="modal">
      <div class="modal-content">
        <span class="close-button">×</span>
        <p class="modal-message"></p>
      </div>
    </div>
  
    <script>
      function limparCampos() {
          document.getElementById('datainicial').value = '';
          document.getElementById('datafinal').value = '';
          document.getElementById('mesLancamento').value = '';
          document.getElementById('anoLancamento').value = '';
          document.getElementById('categoria_real').value = '';
          document.getElementById('cartao_real').value = '';
          document.getElementById('descricao_real').value = '';
  
          const categoriaSelect = document.getElementById('categoria');
            if (categoriaSelect) {
                categoriaSelect.value = '';
                categoriaSelect.disabled = true;
                categoriaSelect.style.display = 'none';
            }
            const categoriaButton = document.getElementById('categoriabutton');
            if(categoriaButton){
                categoriaButton.style.backgroundColor = '#8b0000';
                categoriaButton.style.color = '#fff';
            }
  
            const cartaoSelect = document.getElementById('cartao');
  
            if (cartaoSelect) {
                cartaoSelect.value = '';
                cartaoSelect.disabled = true;
                cartaoSelect.style.display = 'none';
            }
  
            const cartaoButton = document.getElementById('cartaobutton');
            if(cartaoButton){
                cartaoButton.style.backgroundColor = '#8b0000';
                cartaoButton.style.color = '#fff';
            }
  
            const descricaoInput = document.getElementById('descricao');
            if(descricaoInput){
                descricaoInput.value = '';
                descricaoInput.disabled = true;
                descricaoInput.style.display = 'none';
            }
            const descricaoButton = document.getElementById('descricaobutton');
            if(descricaoButton){
                descricaoButton.style.backgroundColor = '#8b0000';
                descricaoButton.style.color = '#fff';
            }
      }
  
        function toggleInput(buttonId, inputId, hiddenInputId) {
            const button = document.getElementById(buttonId);
            const input = document.getElementById(inputId);
            const hiddenInput = document.getElementById(hiddenInputId);
  
            if (!button || !input || !hiddenInput) {
                showModal("Elementos não encontrados. Verifique os IDs.");
                return;
            }
  
            if (input.disabled) {
                input.disabled = false;
                input.style.display = "";
                button.style.backgroundColor = '#3498db';
                button.style.color = '#fff';
                button.dataset.ativo = 'true';
            } else {
                input.disabled = true;
                input.style.display = "none";
                input.value = "";
                hiddenInput.value = "";
                button.style.backgroundColor = '#8b0000';
                button.style.color = '#fff';
                button.dataset.ativo = 'false';
            }
          hiddenInput.value = input.value;
          input.addEventListener('input', () => {
            hiddenInput.value = input.value;
          })
        }
  
  
        function toggleSelect(buttonId, selectId, hiddenInputId, texto) {
            const button = document.getElementById(buttonId);
            const select = document.getElementById(selectId);
            const hiddenInput = document.getElementById(hiddenInputId);
  
            if (!button || !select || !hiddenInput) {
                showModal("Elementos não encontrados. Verifique os IDs.");
                return;
            }
  
            function updateHiddenInputValue() {
                hiddenInput.value = select.value;
            }
  
            const placeholderOption = select.querySelector('option[value=""]');
  
            if (select.disabled) {
                select.disabled = false;
                select.style.display = "";
                select.removeAttribute('data-placeholder');
                placeholderOption.textContent = texto;
                select.atualizaCampoOculto = updateHiddenInputValue.bind(select);
                select.addEventListener('change', select.atualizaCampoOculto);
                hiddenInput.value = select.value;
                button.style.backgroundColor = '#3498db';
                button.style.color = '#fff';
                button.dataset.ativo = 'true';
  
            } else {
                select.disabled = true;
                select.style.display = "none";
                select.setAttribute('data-placeholder', 'Filtro desativado');
                placeholderOption.textContent = select.dataset.placeholder;
                select.value = "";
                hiddenInput.value = "";
                select.removeEventListener('change', select.atualizaCampoOculto);
                delete select.atualizaCampoOculto;
                button.style.backgroundColor = '#8b0000';
                button.style.color = '#fff';
                button.dataset.ativo = 'false';
            }
        }
  
        function showModal(message) {
            const modal = document.getElementById('myModal');
            const modalMessage = document.querySelector('.modal-message');
            modalMessage.textContent = message;
            modal.style.display = 'block';
  
            const closeButton = document.querySelector('.close-button');
            closeButton.onclick = function () {
                modal.style.display = 'none';
            }
  
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        }
  
      let currentFilter = 'date-filter';
  
    function toggleSection(sectionId) {
        const dateFilter = document.getElementById('date-filter');
        const launchFilter = document.getElementById('launch-filter');
        const commonFilters = document.getElementById('common-filters');
  
        if (currentFilter === sectionId) {
            return;
        }
  
        if (sectionId === 'date-filter') {
            dateFilter.classList.remove('hidden');
            launchFilter.classList.add('hidden');
            commonFilters.classList.remove('hidden');
            currentFilter = 'date-filter';
        } else if (sectionId === 'launch-filter') {
            launchFilter.classList.remove('hidden');
            dateFilter.classList.add('hidden');
            commonFilters.classList.remove('hidden');
            currentFilter = 'launch-filter';
        }
    }
  
        function filterData() {
            if (currentFilter === 'date-filter') {
                filterByDate();
            } else if (currentFilter === 'launch-filter') {
                filterByLaunch();
            }
        }
  
        function filterByDate() {
            const datainicial = document.getElementById('datainicial').value;
            const datafinal = document.getElementById('datafinal').value;
            const categoriadata = document.getElementById('categoria_real').value;
            const cartaodata = document.getElementById('cartao_real').value;
            const descricaodata = document.getElementById('descricao_real').value;
  
            if (!datainicial || !datafinal) {
                showModal('Preencha as duas datas.');
                return;
            }
  
            const dateInicialObj = new Date(datainicial);
            const dateFinalObj = new Date(datafinal);
  
  
            if (dateInicialObj > dateFinalObj) {
                showModal("A data inicial não pode ser maior que a data final.");
                return;
            }
  
            function formatDate(dateString) {
                const date = new Date(dateString + 'T00:00:00');
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return day + "-" + month + "-" + year;
            }
  
            const formattedDatainicial = formatDate(datainicial);
            const formattedDatafinal = formatDate(datafinal);
  
            const params = new URLSearchParams();
            params.append('tipo', 'Cartão de Crédito');
            params.append('operador', 'Gabriel Souza Ramos');
            params.append('datainicial', formattedDatainicial);
            params.append('datafinal', formattedDatafinal);
            params.append('filtros', 'Não mostrar');
            params.append('status', 'Efetuado');
  
            if (categoriadata) {
                params.append('categoria', categoriadata);
            }
  
            if (cartaodata) {
                params.append('cartaoCredito', cartaodata);
            }
  
            if (descricaodata) {
                params.append('descricao', descricaodata);
            }
  
            const encodedParams = btoa(params.toString());
            window.location.href = '?=' + encodedParams;
        }
  
        function filterByLaunch() {
            const mesLancamento = document.getElementById('mesLancamento').value;
            const anoLancamento = document.getElementById('anoLancamento').value;
            const categorialancamento = document.getElementById('categoria_real').value;
            const cartaolancamento = document.getElementById('cartao_real').value;
            const descricaolancamento = document.getElementById('descricao_real').value;
  
            if (!mesLancamento) {
                showModal("Selecione um mês de lançamento.");
                return;
            }
  
            if (!anoLancamento || isNaN(parseInt(anoLancamento)) || parseInt(anoLancamento) < 2024 || parseInt(anoLancamento) > 9999) {
                showModal('O ano de lançamento deve ser um número entre 2024 e 9999.');
                return;
            }
  
            const lancamentocartao = mesLancamento + '-' + anoLancamento;
            const params = new URLSearchParams();
            params.append('tempo', 'Tudo');
            params.append('tipo', 'Cartão de Crédito');
            params.append('operador', 'Gabriel Souza Ramos');
            params.append('lancamentocartao', lancamentocartao);
            params.append('filtros', 'Não mostrar');
            params.append('status', 'Efetuado');
  
            if (categorialancamento) {
                params.append('categoria', categorialancamento);
            }
  
            if (cartaolancamento) {
                params.append('cartaoCredito', cartaolancamento);
            }
  
            if (descricaolancamento) {
                params.append('descricao', descricaolancamento);
            }
  
            const encodedParams = btoa(params.toString());
            window.location.href = '?=' + encodedParams;
        }
    </script>
    </body>
    </html>
  `;
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
    });
  }
# 📊 Relatórios de Finanças - Worker

Este projeto contém um serviço web implementado como Cloudflare Worker para geração de relatórios financeiros. O serviço processa parâmetros de filtro, consulta uma API Google Apps Script para obtenção de dados e retorna relatórios formatados em HTML.

## ✨ Funcionalidades

- **Relatórios Financeiros:** Gera relatórios detalhados de transações financeiras
- **Filtros Avançados:** Permite filtrar por data, tipo de transação, categoria, cartão de crédito e muito mais
- **Visualização Personalizada:** Interface responsiva para consulta de dados
- **Segurança:** Autenticação via token para proteção dos dados
- **Codificação Base64:** Suporte a parâmetros codificados para URLs mais limpas
- **Página Específica:** Interface dedicada para o usuário Gabriel

## 🔄 Como Funciona

O worker intercepta requisições HTTP, processa os parâmetros de filtro e os encaminha para um Google Apps Script que contém a lógica de negócios e acesso aos dados. Os resultados são retornados como HTML formatado para o usuário final.

## 🔌 Endpoints

1. **Página Principal**
   - **URL:** `/`
   - **Método:** `GET`
   - **Parâmetros:** Diversos parâmetros de filtro (tempo, tipo, operador, datas, etc.)
   - **Resposta:** Relatório financeiro em formato HTML

2. **Página Gabriel**
   - **URL:** `/?=gabriel`
   - **Método:** `GET`
   - **Resposta:** Interface personalizada para filtro de transações do usuário Gabriel

3. **Renderização Direta**
   - **URL:** `/?htmlgerado=...`
   - **Método:** `GET` 
   - **Parâmetros:** HTML pré-gerado
   - **Resposta:** Renderização do HTML fornecido

## 🛠️ Tecnologias Utilizadas

- **Cloudflare Workers:** Plataforma serverless para hospedagem do código
- **JavaScript:** Linguagem de programação principal
- **Google Apps Script:** BackEnd para processamento de dados e lógica de negócios
- **HTML/CSS:** Interface de usuário
- **Base64:** Codificação de parâmetros complexos

## 🔐 Segurança

- Autenticação via senha armazenada como variável de ambiente
- Suporte a tokens criptográficos para comunicação segura com o Google Apps Script
- Validação de parâmetros para prevenir injeções

## 📋 Requisitos

- Conta Cloudflare com Workers habilitado
- Google Apps Script configurado no URL especificado no código
- Variáveis de ambiente configuradas corretamente

## 🚨 Limitações

- O serviço depende de um Google Apps Script externo para funcionar corretamente
- A autenticação é baseada em uma senha simples armazenada como variável de ambiente
- O código está otimizado para um conjunto específico de tipos de relatório
- Alguns filtros são específicos para o contexto do usuário "Gabriel"

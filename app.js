const TinyAPI = 'YOUR API'
const url = 'https://api.tinyurl.com/create?api_token=' + TinyAPI
const axios = require('axios')
const fs = require('fs')
const caminhoArquivo = 'links.txt';


function generateRandomFileName() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomName = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomName += chars.charAt(randomIndex);
    }
    return randomName + '.txt';
  }


  async function lerLinksDoArquivo(caminhoArquivo) {
    return new Promise((resolve, reject) => {
      fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const links = data.split(',').map(link => link.trim());
        resolve(links);
      });
    });
  }
  
  async function main() {
    try {
      const links = await lerLinksDoArquivo(caminhoArquivo);
      const data = links.map(link => ({ url: link }));
      const responses = await shortManyLinks(data);
  
      // Extrai apenas as URLs encurtadas das respostas da API
      const urlsEncurtadas = responses.map((response, index) => `${index + 1}. ${response.data.tiny_url}`);
  
      // Gera um nome aleatório para o arquivo de saída
      const nomeArquivoSaida = generateRandomFileName();
  
      // Salva as URLs encurtadas numeradas no arquivo
      fs.writeFile(nomeArquivoSaida, urlsEncurtadas.join('\n'), 'utf8', err => {
        if (err) {
          console.error('Erro ao salvar o arquivo:', err);
          return;
        }
        console.log('URLs encurtadas numeradas salvas no arquivo:', nomeArquivoSaida);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  
  async function shortManyLinks(data) {
    const responses = [];
    for (let i = 0; i < data.length; i++) {
      try {
        const response = await axios.post(url, data[i]);
        responses.push(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    return responses;
  }
  
  main();

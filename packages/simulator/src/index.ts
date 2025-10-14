import axios from 'axios';
import 'dotenv/config';

// --- CONFIGURAÇÃO ---
// Crie um arquivo .env nesta pasta com essas variáveis
const API_KEY = process.env.API_KEY || '';
const SENSOR_ID = process.env.SENSOR_ID || '';
const API_URL = 'http://localhost:3333/readings';
const INTERVAL_SECONDS = 10;
// --------------------

let currentValue = 25; // Valor inicial da temperatura

async function sendReading() {
  // Simula uma pequena variação na leitura
  const variation = Math.random() * 2 - 1; // Gera um número entre -1 e 1
  currentValue += variation;

  const reading = {
    sensor_id: SENSOR_ID,
    value: parseFloat(currentValue.toFixed(2)),
  };

  try {
    console.log(`Enviando leitura: ${reading.value}...`);

    await axios.post(API_URL, reading, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    console.log('Leitura enviada com sucesso!');
  } catch (error: any) {
    console.error('Erro ao enviar leitura:', error.response?.data || error.message);
  }
}

console.log('--- Iniciando Simulador de Dispositivo AgriSentry ---');
console.log(`Enviando dados para o sensor ${SENSOR_ID} a cada ${INTERVAL_SECONDS} segundos.`);

// Roda a função a cada X segundos
setInterval(sendReading, INTERVAL_SECONDS * 1000);
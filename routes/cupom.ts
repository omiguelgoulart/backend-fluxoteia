import { Router } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = Router();

router.get('/buscar-dados', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      res.status(400).json({ error: 'A URL do QR Code é obrigatória.' });
      return;
    }

    try {
        // Faz a requisição HTTP para a URL do QR Code
        const response = await axios.get(url as string);
        const html: string = response.data as string;

        // Carrega o HTML da página com cheerio
        const $ = cheerio.load(html);

        // Extrai os dados desejados
        const nomeEstabelecimento = $('.txtTopo').first().text().trim();
        const valorTotal = $('#linhaTotal .txtMax').first().text().trim();
        const dataEmissao = $('strong:contains("Emissão:")')
            .parent()
            .text()
            .split('Emissão:')[1]
            .trim()
            .split('-')[0]
            .trim();

        // Extrai o número e a série do cupom fiscal
        const numeroSerieText = $('li:contains("Número:")').text();
        const numero = numeroSerieText.match(/Número:\s(\d+)/)?.[1];
        const serie = numeroSerieText.match(/Série:\s(\d+)/)?.[1];

        // Concatena número e série no formato "numero/serie"
        const numeroSerie = numero && serie ? `${numero}/${serie}` : null;

        // Retorna os dados extraídos em formato JSON
        res.json({
            nome: nomeEstabelecimento,
            valor: valorTotal,
            data: dataEmissao,
            number: numeroSerie,
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        res.status(500).json({ error: 'Erro ao buscar os dados do cupom fiscal.' });
    }
});

export default router;

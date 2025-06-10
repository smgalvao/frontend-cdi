import React, { useState } from 'react';
import axios from 'axios';

function CorrecaoForm() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [percentualCdi, setPercentualCdi] = useState('');
  const [cdiPlus, setCdiPlus] = useState('');
  const [valorCorrigir, setValorCorrigir] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatarPercentual = (valor) =>
    `${(valor * 100).toFixed(2)}%`;

  const formatarDataLocal = (dataIso) => {
    const [ano, mes, dia] = dataIso.split('-');
    const data = new Date(ano, mes - 1, dia);
    return data.toLocaleDateString('pt-BR');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    try {
      const response = await axios.post('https://backend-cdi.onrender.com/api/calcular-correcao', {
        data_inicio: dataInicio,
        data_fim: dataFim,
        percentual_cdi: parseFloat(percentualCdi),
        cdi_plus: parseFloat(cdiPlus),
        valor_corrigir: parseFloat(valorCorrigir),
      });

      setResultado(response.data);
    } catch (error) {
      console.error(error);
      setErro('Erro ao calcular correção. Verifique os dados ou tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Calculadora de Correção CDI</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data Inicial:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </div>
        <div>
          <label>Data Final:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
        </div>
        <div>
          <label>% do CDI:</label>
          <input type="number" step="0.01" value={percentualCdi} onChange={(e) => setPercentualCdi(e.target.value)} required />
        </div>
        <div>
          <label>CDI + (em % ao ano):</label>
          <input type="number" step="0.01" value={cdiPlus} onChange={(e) => setCdiPlus(e.target.value)} required />
        </div>
        <div>
          <label>Valor a Corrigir (R$):</label>
          <input type="number" step="0.01" value={valorCorrigir} onChange={(e) => setValorCorrigir(e.target.value)} required />
        </div>
        <button type="submit">Calcular</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {resultado && (
        <div style={{ marginTop: 20 }}>
          <h3>Resultado</h3>
          <p><strong>Data Inicial:</strong> {formatarDataLocal(dataInicio)}</p>
          <p><strong>Data Final:</strong> {formatarDataLocal(dataFim)}</p>
          <p><strong>Dias Úteis:</strong> {resultado.dias_uteis}</p>
          <p><strong>Percentual CDI:</strong> {parseFloat(percentualCdi).toFixed(2)}%</p>
          <p><strong>CDI +:</strong> {parseFloat(cdiPlus).toFixed(2)}%</p>
          <p><strong>Taxa:</strong> {parseFloat(percentualCdi).toFixed(2)}% do CDI + {parseFloat(cdiPlus).toFixed(2)}%</p>
          <p><strong>Valor Base:</strong> {formatarMoeda(parseFloat(valorCorrigir))}</p>
          <p><strong>Fator de Correção:</strong> {resultado.fator_correcao.toFixed(8)}</p>
          <p><strong>Valor Corrigido:</strong> {formatarMoeda(resultado.valor_corrigido)}</p>
          <p><strong>Valor da Correção:</strong> {formatarMoeda(resultado.valor_correcao)}</p>
        </div>
      )}
    </div>
  );
}

export default CorrecaoForm;


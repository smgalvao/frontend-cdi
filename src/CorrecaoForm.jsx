import React, { useState } from 'react';
import axios from 'axios';

const CorrecaoForm = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [percentualCdi, setPercentualCdi] = useState('');
  const [cdiPlus, setCdiPlus] = useState('');
  const [valorCorrigir, setValorCorrigir] = useState('');
  const [resultado, setResultado] = useState(null);

  const ajustarData = (dateStr) => {
    const date = new Date(dateStr);
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resposta = await axios.post('https://backend-cdi.onrender.com/api/calcular-correcao', {
        data_inicio: ajustarData(dataInicio),
        data_fim: ajustarData(dataFim),
        percentual_cdi: parseFloat(percentualCdi),
        cdi_plus: parseFloat(cdiPlus),
        valor_corrigir: parseFloat(valorCorrigir),
      });

      setResultado(resposta.data);
    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert("Erro ao calcular. Verifique os dados e tente novamente.");
    }
  };
  
  const formatarDataLocal = (dataIso) => {
    const [ano, mes, dia] = dataIso.split('-');
    const data = new Date(ano, mes - 1, dia);
    return data.toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Correção CDI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Data Inicial:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label>Data Final:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label>Percentual do CDI (%):</label>
          <input type="number" step="0.01" value={percentualCdi} onChange={(e) => setPercentualCdi(e.target.value)} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label>CDI Plus (%):</label>
          <input type="number" step="0.01" value={cdiPlus} onChange={(e) => setCdiPlus(e.target.value)} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label>Valor a Corrigir (R$):</label>
          <input type="number" step="0.01" value={valorCorrigir} onChange={(e) => setValorCorrigir(e.target.value)} required className="border rounded px-2 py-1 w-full" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calcular</button>
      </form>

      {resultado && (
        <div className="resultado">
          <h2>Resultado</h2>
          <p><strong>Data Inicial:</strong> {formatarDataLocal(dataInicio)}</p>
          <p><strong>Data Final:</strong> {formatarDataLocal(dataFim)}</p>
          <p><strong>Dias Úteis:</strong> {resultado.dias_uteis}</p>
          <p><strong>Taxa ao ano:</strong> {formatarPercentual(formulario.percentual_cdi)} do CDI + {formatarPercentual(formulario.cdi_plus)}</p>
          <p><strong>Valor Base:</strong> {formatarMoeda(formulario.valor_corrigir)}</p>
          <p><strong>Fator de Correção:</strong> {resultado.fator_correcao.toFixed(8)}</p>
          <p><strong>Valor Corrigido:</strong> {formatarMoeda(resultado.valor_corrigido)}</p>
          <p><strong>Valor da Correção:</strong> {formatarMoeda(resultado.valor_correcao)}</p>
        </div>
      )}
    </div>
  );
};

export default CorrecaoForm;


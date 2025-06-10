import React, { useState } from "react";
import axios from "axios";

function CorrecaoForm() {
  const [formulario, setFormulario] = useState({
    data_inicio: "",
    data_fim: "",
    percentual_cdi: "",
    cdi_plus: "",
    valor_corrigir: ""
  });

  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setResultado(null);
    try {
      const response = await axios.post("https://backend-cdi.onrender.com/api/calcular-correcao", {
        ...formulario,
        percentual_cdi: parseFloat(formulario.percentual_cdi),
        cdi_plus: parseFloat(formulario.cdi_plus),
        valor_corrigir: parseFloat(formulario.valor_corrigir)
      });
      setResultado(response.data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao calcular a correção. Verifique os dados e tente novamente.");
    }
  };

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const formatarPercentual = (valor) =>
    `${parseFloat(valor).toFixed(2)}%`;

  const formatarData = (dataISO) =>
    new Date(dataISO).toLocaleDateString('pt-BR');

  return (
    <div className="formulario">
      <h1>Calculadora de Correção CDI</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Data Inicial:
          <input type="date" name="data_inicio" value={formulario.data_inicio} onChange={handleChange} required />
        </label>
        <label>
          Data Final:
          <input type="date" name="data_fim" value={formulario.data_fim} onChange={handleChange} required />
        </label>
        <label>
          Percentual CDI (%):
          <input type="number" name="percentual_cdi" value={formulario.percentual_cdi} onChange={handleChange} required step="0.01" />
        </label>
        <label>
          CDI + (% ao ano):
          <input type="number" name="cdi_plus" value={formulario.cdi_plus} onChange={handleChange} required step="0.01" />
        </label>
        <label>
          Valor a Corrigir (R$):
          <input type="number" name="valor_corrigir" value={formulario.valor_corrigir} onChange={handleChange} required step="0.01" />
        </label>
        <button type="submit">Calcular</button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {resultado && (
        <div className="resultado">
          <h2>Resultado</h2>
          <p><strong>Data Inicial:</strong> {formatarData(formulario.data_inicio)}</p>
          <p><strong>Data Final:</strong> {formatarData(formulario.data_fim)}</p>
          <p><strong>Percentual CDI:</strong> {formatarPercentual(formulario.percentual_cdi)}</p>
          <p><strong>Aplicação:</strong> {formatarPercentual(formulario.percentual_cdi)} do CDI + {formatarPercentual(formulario.cdi_plus)}</p>
          <p><strong>Valor Base:</strong> {formatarMoeda(formulario.valor_corrigir)}</p>
          <p><strong>Valor Calculado:</strong> {formatarMoeda(resultado.valor_corrigido)}</p>
          <p><strong>Valor Corrigido:</strong> {formatarMoeda(resultado.valor_corrigido)}</p>
          <p><strong>Valor da Correção:</strong> {formatarMoeda(resultado.valor_correcao)}</p>
        </div>
      )}
    </div>
  );
}

export default CorrecaoForm;


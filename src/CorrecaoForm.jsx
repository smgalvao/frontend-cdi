import React, { useState, useEffect } from "react";
import axios from "axios";

function CorrecaoForm() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [percentualCdi, setPercentualCdi] = useState("");
  const [cdiPlus, setCdiPlus] = useState("");
  const [valorCorrigir, setValorCorrigir] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const [dataMin, setDataMin] = useState(null);
  const [dataMax, setDataMax] = useState(null);

  // Função para formatar datas no padrão pt-BR
  const formatarDataLocal = (dataIso) => {
    if (!dataIso) return "";
    // Caso venha com hora, remove a parte da hora (ex: "2025-06-10T00:00:00")
    const dataSemHora = dataIso.split("T")[0];
    const [ano, mes, dia] = dataSemHora.split("-");
    const data = new Date(ano, mes - 1, dia);
    return data.toLocaleDateString("pt-BR");
  };

  // Buscar período disponível do backend quando o componente montar
  useEffect(() => {
    async function buscarPeriodo() {
      try {
        const response = await axios.get(
          "https://backend-cdi.onrender.com/api/periodo-disponivel"
        );
        setDataMin(response.data.data_min);
        setDataMax(response.data.data_max);
      } catch (error) {
        setDataMin(null);
        setDataMax(null);
      }
    }
    buscarPeriodo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    try {
      const response = await axios.post(
        "https://backend-cdi.onrender.com/api/calcular-correcao",
        {
          data_inicio: dataInicio,
          data_fim: dataFim,
          percentual_cdi: parseFloat(percentualCdi),
          cdi_plus: parseFloat(cdiPlus),
          valor_corrigir: parseFloat(valorCorrigir),
        }
      );
      setResultado(response.data);
    } catch (error) {
      setErro(
        error.response?.data?.detail ||
          "Erro ao calcular correção. Verifique os dados e tente novamente."
      );
    }
  };

  // Formatação do fator de correção com vírgula
  const formatarFatorCorrecao = (fator) => {
    return fator.toFixed(8).replace(".", ",");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Calculadora de Correção CDI</h2>
      {(dataMin && dataMax) && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9em",
            marginTop: "-10px",
            marginBottom: "15px",
          }}
        >
          Período disponível entre: {formatarDataLocal(dataMin)} até{" "}
          {formatarDataLocal(dataMax)}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Data início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
            min={dataMin ? dataMin.split("T")[0] : undefined}
            max={dataMax ? dataMax.split("T")[0] : undefined}
          />
        </div>

        <div>
          <label>Data fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
            min={dataMin ? dataMin.split("T")[0] : undefined}
            max={dataMax ? dataMax.split("T")[0] : undefined}
          />
        </div>

        <div>
          <label>Percentual CDI (%):</label>
          <input
            type="number"
            step="0.01"
            value={percentualCdi}
            onChange={(e) => setPercentualCdi(e.target.value)}
            required
          />
        </div>

        <div>
          <label>CDI Plus (%):</label>
          <input
            type="number"
            step="0.01"
            value={cdiPlus}
            onChange={(e) => setCdiPlus(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Valor a corrigir:</label>
          <input
            type="number"
            step="0.01"
            value={valorCorrigir}
            onChange={(e) => setValorCorrigir(e.target.value)}
            required
          />
        </div>

        <button type="submit">Calcular</button>
      </form>

      {erro && (
        <div style={{ color: "red", marginTop: 15 }}>
          <strong>{erro}</strong>
        </div>
      )}

      {resultado && (
        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Fator de correção:</strong>{" "}
            {formatarFatorCorrecao(resultado.fator_correcao)}
          </p>
          <p>
            <strong>Dias úteis:</strong> {resultado.dias_uteis}
          </p>
          <p>
            <strong>Valor corrigido:</strong>{" "}
            R$ {resultado.valor_corrigido.toFixed(2).replace(".", ",")}
          </p>
          <p>
            <strong>Valor da correção:</strong>{" "}
            R$ {resultado.valor_correcao.toFixed(2).replace(".", ",")}
          </p>
        </div>
      )}
    </div>
  );
}

export default CorrecaoForm;


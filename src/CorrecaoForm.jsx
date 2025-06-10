import { useState } from 'react';
import axios from 'axios';

export default function CorrecaoForm() {
  const [form, setForm] = useState({
    data_inicio: '',
    data_fim: '',
    percentual_cdi: '',
    cdi_plus: '',
    valor_corrigir: ''
  });

  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://backend-cdi.onrender.com/api/calcular-correcao", {
        data_inicio: form.data_inicio,
        data_fim: form.data_fim,
        percentual_cdi: parseFloat(form.percentual_cdi),
        cdi_plus: parseFloat(form.cdi_plus),
        valor_corrigir: parseFloat(form.valor_corrigir)
      });
      setResultado(res.data);
      setErro(null);
    } catch (error) {
      setErro("Erro ao calcular correção. Verifique os dados.");
      setResultado(null);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Correção CDI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border" type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} required />
        <input className="w-full p-2 border" type="date" name="data_fim" value={form.data_fim} onChange={handleChange} required />
        <input className="w-full p-2 border" type="number" step="0.01" name="percentual_cdi" placeholder="% do CDI (ex: 100)" value={form.percentual_cdi} onChange={handleChange} required />
        <input className="w-full p-2 border" type="number" step="0.01" name="cdi_plus" placeholder="CDI + (ex: 1)" value={form.cdi_plus} onChange={handleChange} required />
        <input className="w-full p-2 border" type="number" step="0.01" name="valor_corrigir" placeholder="Valor a corrigir (ex: 1000)" value={form.valor_corrigir} onChange={handleChange} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Calcular</button>
      </form>

      {erro && <p className="text-red-600 mt-4">{erro}</p>}

      {resultado && (
        <div className="mt-6 border p-4">
          <p><strong>Dias úteis:</strong> {resultado.dias_uteis}</p>
          <p><strong>Fator de Correção:</strong> {resultado.fator_correcao}</p>
          <p><strong>Valor Corrigido:</strong> R$ {resultado.valor_corrigido}</p>
          <p><strong>Valor da Correção:</strong> R$ {resultado.valor_correcao}</p>
        </div>
      )}
    </div>
  );
}

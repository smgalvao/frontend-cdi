import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'

export default function CDIForm() {
  const [form, setForm] = useState({
    data_inicio: '',
    data_fim: '',
    percentual_cdi: '100',
    cdi_plus: '0',
    valor_corrigir: '1000',
  })
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const validarDatas = () => {
    try {
      const inicio = new Date(form.data_inicio)
      const fim = new Date(form.data_fim)
      return inicio <= fim
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    setErro('')
    if (!validarDatas()) {
      setErro('A data de início deve ser anterior ou igual à data de fim.')
      return
    }
    try {
      const res = await fetch('/api/calcular-correcao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          percentual_cdi: parseFloat(form.percentual_cdi),
          cdi_plus: parseFloat(form.cdi_plus),
          valor_corrigir: parseFloat(form.valor_corrigir),
        }),
      })
      const data = await res.json()
      setResultado(data)
    } catch (err) {
      setErro('Erro ao calcular correção.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Correção CDI</h1>
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 p-4">
          <div>
            <Label>Data Início</Label>
            <Input type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} />
          </div>
          <div>
            <Label>Data Fim</Label>
            <Input type="date" name="data_fim" value={form.data_fim} onChange={handleChange} />
          </div>
          <div>
            <Label>Percentual CDI (%)</Label>
            <Input name="percentual_cdi" value={form.percentual_cdi} onChange={handleChange} />
          </div>
          <div>
            <Label>CDI Plus (%)</Label>
            <Input name="cdi_plus" value={form.cdi_plus} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor a Corrigir (R$)</Label>
            <Input name="valor_corrigir" value={form.valor_corrigir} onChange={handleChange} />
          </div>
          <Button onClick={handleSubmit}>Calcular</Button>
          {erro && <p className="text-red-600 text-sm">{erro}</p>}
        </CardContent>
      </Card>

      {resultado && (
        <Card className="mt-6">
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">Resultado</h2>
            <p><strong>Valor Corrigido:</strong> R$ {resultado.valor_corrigido.toFixed(2)}</p>
            <p><strong>Fator Acumulado:</strong> {resultado.fator.toFixed(8)}</p>
            <p><strong>Dias Úteis:</strong> {resultado.dias_uteis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

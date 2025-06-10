document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('correcaoForm');
    const resultadoDiv = document.getElementById('resultado');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar loading
        resultadoDiv.innerHTML = '<p>Calculando... Aguarde.</p>';

        const requestData = {
            data_inicio: document.getElementById('data_inicio').value,
            data_fim: document.getElementById('data_fim').value,
            percentual_cdi: parseFloat(document.getElementById('percentual_cdi').value),
            cdi_plus: parseFloat(document.getElementById('cdi_plus').value),
            valor_corrigir: parseFloat(document.getElementById('valor_corrigir').value)
        };

        try {
            // Substitua pela URL do seu backend no Render
            const response = await fetch('https://backend-api.onrender.com/api/calcular-correcao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            // Formatando o resultado
            resultadoDiv.innerHTML = `
                <h3>Resultado da Correção</h3>
                <p><strong>Valor Original:</strong> R$ ${requestData.valor_corrigir.toFixed(2)}</p>
                <p><strong>Valor Corrigido:</strong> R$ ${data.valor_corrigido.toFixed(2)}</p>
                <p><strong>Correção:</strong> R$ ${data.valor_correcao.toFixed(2)}</p>
                <p><strong>Fator de Correção:</strong> ${data.fator_correcao}</p>
                <p><strong>Dias Úteis no Período:</strong> ${data.dias_uteis}</p>
            `;
        } catch (error) {
            resultadoDiv.innerHTML = `<p class="error">Erro no cálculo: ${error.message}</p>`;
        }
    });
});

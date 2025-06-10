document.addEventListener('DOMContentLoaded', function() {
    // Formulário de Consulta
    const consultaForm = document.getElementById('consultaForm');
    const consultaResult = document.getElementById('consultaResult');
    
    consultaForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            param1: document.getElementById('param1').value,
            param2: document.getElementById('param2').value
        };
        
        try {
            consultaResult.innerHTML = '<p>Enviando consulta...</p>';
            
            // Substitua pela URL real da sua API
            const response = await fetch('https://sua-api.com/endpoint-consulta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            // Formata a resposta para exibição
            consultaResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            consultaResult.innerHTML = `<p class="error">Erro na consulta: ${error.message}</p>`;
        }
    });
    
    // Formulário de Cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    const cadastroResult = document.getElementById('cadastroResult');
    
    cadastroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            detalhes: document.getElementById('detalhes').value
        };
        
        try {
            cadastroResult.innerHTML = '<p>Enviando cadastro...</p>';
            
            // Substitua pela URL real da sua API
            const response = await fetch('https://sua-api.com/endpoint-cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            // Formata a resposta para exibição
            cadastroResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            cadastroResult.innerHTML = `<p class="error">Erro no cadastro: ${error.message}</p>`;
        }
    });
});

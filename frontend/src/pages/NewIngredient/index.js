import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import './styles.css';

import logoImg from '../../assets/random_foods.png';
import api from '../../services/api';

export default function Ingrediente() {

    const [ nome, setNome ] = useState('');
    const [ id_tipo_unidade, setTipoUnidade] = useState('');
    const [ tipoUnidades, setTipoUnidades ] = useState([]);
    
    useEffect(() => {
        api.get('tipo-unidades', ).then(response => {
            setTipoUnidades(response.data);
        });
    }, []);
    
    async function handleIngredient(e) {
        e.preventDefault();

        const data = {
            nome,
            id_tipo_unidade
        };

        try {
            const response = await api.post('ingrediente', data);

            alert(`${ nome } cadastrado com sucesso!`);
        } catch (error) {
            alert('Falha na cadastração, faz essa porra direito.');
        }

    }
    
    return (
        <div className="converter-container">
            <section className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />

                <form className="combo-box" onSubmit={ handleIngredient }>
                    <h1>Cadastre já!</h1>
                    <input
                        placeholder="Nome"
                        value={ nome }
                        required
                        onChange={ e => setNome(e.target.value) }
                    />
                    <Select
                        options={tipoUnidades}
                        onChange={ e => setTipoUnidade(e.value) }
                    />
                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </section>
        </div>
    );
}
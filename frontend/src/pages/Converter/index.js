import React, { useEffect, useState, Component } from 'react';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/random_foods.svg';
import foodImg from '../../assets/food.png';
import api from '../../services/api';

export default function Converter() {

    const [ id_origem, setIdOrigem ] = useState('');
    const [ id_destino, setIdDestino ] = useState('');
    const [ valor, setValor ] = useState('');
    const [ unidades, setUnidades ] = useState([]);
    
    useEffect(() => {
        api.get('unidadeList', ).then(response => {
            setUnidades(response.data);
        });
    }, []);
    
    async function handleConverter(e) {
        e.preventDefault();

        const data = {
            id_origem,
            id_destino,
            valor
        };

        try {
            const response = await api.post('converter', data);

            alert(`${ valor } ${ response.data.unidadeAnterior }(s)\n   equivale à\n${ response.data.valorConvertido } ${ response.data.unidadeAtual }(s)`);
        } catch (error) {
            alert('Falha na conversão, faz essa porra direito.');
        }

    }
    
    return (
        <div className="converter-container">
            <section className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />

                <form onSubmit={ handleConverter }>
                    <h1>Converta já!</h1>
                    <Select
                        options={unidades}
                        onChange={ e => setIdOrigem(e.value) }
                    />
                    <Select
                        options={unidades}
                        onChange={ e => setIdDestino(e.value) }
                    />
                    <input
                        placeholder="Quantidade"
                        value={ valor }
                        required
                        onChange={ e => setValor(e.target.value) }
                    />
                    <button className="button" type="submit">Converter</button>
                </form>
            </section>
            <img src={foodImg} alt="Imagem" style={{ maxWidth: 600 }}/>
        </div>
    );
}
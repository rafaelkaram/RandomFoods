import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.png'
import api from '../../services/api';

export default function SignUp() {
    const [ nome, setNome ] = useState('');

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        const data = {
            nome
        };

        try {
            const response = await api.post('tipo-ingrediente', data);

            alert('Tipo de ingrediente cadastrado com sucesso!');

            history.push('/');
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    return (
        <div className="ingredient-type-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Tipo de Ingrediente</h1>
                    <p>Cadastre seu tipo de ingrediente abaixo.</p>

                    <Link to='/' className="back-link">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar
                    </Link>
                </section>
                <form onSubmit={ handleRegister }>
                    <input
                        className="input-text"
                        placeholder="Nome"
                        value={ nome }
                        required
                        onChange={ e => setNome(e.target.value) }
                    />

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
    
        </div>
    );
}
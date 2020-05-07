import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.png'
import api from '../../services/api';

export default function SignUp() {
    const [ nome, setNome ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');

    const history = useHistory;

    async function handleRegister(e) {
        e.preventDefault();

        const data = {
            nome,
            email,
            senha
        };

        try {
            const response = await api.post('user', data);

            alert('Ususario cadastrado com sucesso!');

            history.push('/');
        } catch (error) {
            alert('Erro no cadastro, se fodeo mermão!');
        }
    }

    return (
        <div className="signup-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem receitas bacanas.</p>

                    <Link to='/' className="back-link">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar
                    </Link>
                </section>
                <form onSubmit={ handleRegister }>
                    <input
                        placeholder="Nome"
                        value={ nome }
                        required
                        onChange={ e => setNome(e.target.value) }
                    />
                    <input 
                        placeholder="E-mail"
                        value={ email }
                        type="email"
                        required
                        onChange={ e => setEmail(e.target.value) }
                    />
                    <input
                        placeholder="Senha"
                        value={ senha }
                        type="password"
                        required
                        onChange={ e => setSenha(e.target.value) }                    />
                    <div className="input-group">
                        <input placeholder="Cidade"/>
                        <input placeholder="UF" style={{ width: 80 }}/>
                    </div>

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
    
        </div>
    );
}
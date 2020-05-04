import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.svg'
import foodImg from '../../assets/food.png';
import api from '../../services/api';

export default function Login() {
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');

    const history = useHistory();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await api.post('session',  { email, senha });

            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', response.data.nome);

            history.push('/profile');
        } catch (error) {
            alert('Falha no login, tente novamente.');
        }

    }

    return (
        <div className="login-container">
            <section className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />

                <form onSubmit={ handleLogin } >
                    <h1>Faça seu login</h1>
                    <input
                        placeholder="E-mail"
                        type="email"
                        value={ email }
                        required
                        onChange={ e => setEmail(e.target.value) }
                    />
                    <input
                        placeholder="Senha"
                        type="password"
                        value={ senha }
                        required
                        onChange={ e => setSenha(e.target.value) }
                    />
                    <button type="submit" className="button">Entrar</button>

                    <Link to='/signup' className="back-link">
                        <FiLogIn size={16} color="#E02041"/>
                        Não tenho cadastro
                    </Link>
                </form>
            </section>
            <img src={foodImg} alt="Imagem" />
        </div>
    );
}
 
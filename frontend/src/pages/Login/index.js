import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.svg'
import foodImg from '../../assets/food.png';

export default function Logon() {
    return (
        <div className="login-container">
            <section className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />

                <form action="">
                    <h1>Faça seu login</h1>
                    <input placeholder="E-mail" />
                    <input placeholder="Senha" />
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
 
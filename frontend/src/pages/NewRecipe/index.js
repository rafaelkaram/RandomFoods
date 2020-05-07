import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.png';

export default function SignUp() {
    return (
        <div className="new-recipe-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastrar nova receita</h1>
                    <p>De um titulo, liste os ingredientes e faça o passo-a-passo para ajudar quem está querendo cozinhar.</p>

                    <Link to='/' className="back-link">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar para Home
                    </Link>
                </section>
                <form>
                    <input placeholder="Nome da Receita" />
                    <textarea placeholder="Descrição"/>
                    <input placeholder="Tipo"/>

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
    
        </div>
    );
}
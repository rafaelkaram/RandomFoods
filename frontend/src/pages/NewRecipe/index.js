import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.svg';

export default function SignUp() {
    return (
        <div className="new-recipe-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>

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
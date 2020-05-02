import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.svg'
import foodImg from '../../assets/food.png';

export default function Logon() {
    return (
        <div className="profile-container">
            <header className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />
                <span>Bem vindo, tãnãnã</span>
                <Link to="/recipe/new" className="button">Cadastrar Novo Caso</Link>
                <button type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>
            
            <h1>Casos Cadastrados</h1>
            
            <ul>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <strong>CASO:</strong>
                    <p>Caso teste</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>Descrição teste</p>

                    <strong>VALOR:</strong>
                    <p>R$120,00</p>

                    <button>
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
            </ul>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.svg';
import api from '../../services/api';

export default function Profile() {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    const [ recipes, setRecipes ] = useState([]);

    useEffect(() => {
        api.get('profile', {
            headers: {
                AuthorizationId: id,
                AuthorizationLogin: email,
            }
        }).then(response => {
            setRecipes(response.data);

        })
    }, [ name ]);

    async function handleDeleteRecipe(id) {
        try {
            await api.delete(`receita/${id}`, {
                headers: {
                    AuthorizationId: id,
                }
            });

            setRecipes(recipes.filter(recipe => recipe.id !== id));
        } catch (error) {
            console.log(error);
            alert('')
        }

    }

    return (
        <div className="profile-container">
            <header className="form">
                <img src={logoImg} alt="Random Foods" className="random-foods" />
                <span>Bem vindo, { name }</span>
                <Link to="/recipe/new" className="button">Cadastrar Nova Receita</Link>
                <button type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>
            
            <h1>Receitas Cadastradas</h1>
            
            <ul>
                { recipes.map(recipe => (
                    <li key={ recipe.id }>
                        <strong>CASO:</strong>
                        <p>{ recipe.nome }</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{ recipe.descricao }</p>

                        <strong>TIPO:</strong>
                        <p>{ recipe.tipo }</p>

                        <strong>DATA CADASTRO:</strong>
                        <p>{ Intl.DateTimeFormat('pt-BR').format(recipe.data_cadastro) }</p>

                        <button onClick={() => handleDeleteRecipe(recipe.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
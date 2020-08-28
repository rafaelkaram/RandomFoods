import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {RadioButton,RadioGroup,ReversedRadioButton} from 'react-radio-buttons';
import './styles.css';

import logoImg from '../../assets/random_foods.png';
import api from '../../services/api';


export default function NewRecipe() {
    const [ ingredient, setIngredient ] = useState([]);
    const [ ingredientTypes, setIngredientTypes] = useState([]);

    useEffect(() => {
        // api.get('ingrediente')
        //     .then(response => {
        //         setIngredient(response.data);
        //     });
        api.get('ingredientetype')
            .then(response => {
                setIngredientTypes(response.data);
            })
    }, []);



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
                    <input className="input-text" placeholder="Nome da Receita" />
                    {/* <RadioGroup  horizontal>
                    <RadioButton value="salgado">
                        Salgado
                    </RadioButton>
                    <RadioButton value="doce">
                        Doce
                    </RadioButton>
                    </RadioGroup>
                    <textarea placeholder="Descrição"/>
                    <input className="input-text" placeholder="Tipo"/> */}

                    {ingredientTypes.map(ingredientTypes =>{
                        return(
                            <div className="ingredients-grid">
                                 <h5 key={ingredientTypes.tipo}>{ingredientTypes.tipo}</h5>
                                 <img src={ingredientTypes.image_url + `massas-colored.svg`} alt={ingredientTypes.tipo}></img>
                                 <div>
                                    {ingredientTypes.ingredientes.map(ingredinete =>{
                                        return(
                                          <div
                                             key={ingredinete.id}
                                             value={ingredinete.id}>
                                             {ingredinete.nome}
                                          </div>  
                                    )})}   
                            </div>     
                            </div>     
                        )
                    })}                  
                </form>
                <button className="button" type="submit">Cadastrar</button> 
            </div>
        </div>
    );
}
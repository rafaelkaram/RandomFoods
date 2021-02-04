import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import './styles.css';
import fixString from '../../assets/functions/utils'

import logoImg from '../../assets/random_foods.png';
import api from '../../services/api';


export default function NewRecipe() {
    const [ ingredientsCart, setIngredientsCart ] = useState([]);
    const [ ingredientTypes, setIngredientTypes] = useState([]);
    const [ selectedItems, setSelectedItems ] = useState([]);
    



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

    function handleSelectItem(id, name){
        const alredySelected = selectedItems.findIndex(item => item === id);
        if(alredySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.id !== id);

            setSelectedItems(filteredItems);
            
            setIngredientsCart(filteredNames);
            
        }else{
            setSelectedItems([...selectedItems, id]);
            setIngredientsCart([...ingredientsCart, {id, name}]);
        }
    }

    return (
        <div className="new-recipe-container">
            <div className="content">
                <div className="ingredients-cart">
                        <h3>Ingredientes</h3>
                    {ingredientsCart.map(ingrediente =>{
                        return(
                            <div
                                    key={ingrediente.id}
                                    value={ingrediente.id}
                                 >
                                     {ingrediente.name}
                                <div onClick={() => handleSelectItem( ingrediente.id, ingrediente.name )}>
                                    <FiTrash2></FiTrash2>
                                </div>
                            </div> 
                        )})}       
                </div>
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastrar nova receita</h1>
                    <p>De um titulo, liste os ingredientes e faça o passo-a-passo para ajudar quem está querendo cozinhar.</p>
                </section>
                <form>
                    <input className="input-text" placeholder="Nome da Receita" />
                    {ingredientTypes.map(ingredientTypes =>{
                        return(
                            <div key={ingredientTypes.tipo}>
                                <br/>
                                <div className="ingredients-grid">
                                    <h3>{ingredientTypes.tipo}</h3>
                                    <img
                                        src={ingredientTypes.image_url + fixString(ingredientTypes.tipo) + `-colored.svg`}
                                        alt={ingredientTypes.tipo}></img>
                                    <div>
                                        {ingredientTypes.ingredientes.map(ingrediente =>{
                                            return(
                                            <div
                                                onClick={() => handleSelectItem( ingrediente.id, ingrediente.nome )}
                                                className={selectedItems.includes(ingrediente.id) ? 'selected' : ''}
                                                key={ingrediente.id}
                                                value={ingrediente.id}
                                            >
                                                {ingrediente.nome}
                                            </div>  
                                        )})}   
                                </div>     
                                </div>  
                            </div>    
                        )
                    })}                 
                </form>
                <button className="button" type="submit">Cadastrar</button> 
                <Link to='/' className="back-link">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar para Home
                    </Link>
            </div>
        </div>
    );
}
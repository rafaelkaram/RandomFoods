import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/random_foods.png';
import api from '../../services/api';

export default function Recipe({ match }) {

    const id = match.params.id;
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    const [ recipe, setRecipe ] = useState();
    const [ comments, setComments ] = useState();
    const [ subComments, setSubComments ] = useState();

    useEffect(() => {
        api.get(`receita/${id}`)
            .then(response => {
                setRecipe(response.data);
            });
        api.get(`comentar/${id}`)
            .then(response => {
                console.log(response.data);
                setComments(response.data.comentarios);
                setSubComments(response.data.filhos);
            });
    }, []);

    function ShowRecipe() {
        if (recipe) {
            const valor = recipe.nota ? recipe.nota : null;
            return (
                <div>
                    <div className="display-group">
                        <div className="title"><strong>RECEITA:</strong></div>
                        <div className="title"><strong>NOTA:</strong></div>
                    </div>
                    <div className="display-group">
                        <div className="title">
                            <p>{ recipe.receita }</p>
                        </div>
                        <div className="title">
                            <p>{ !valor ? 'Receita sem nota.' : valor }</p>
                    </div>
                    </div>
                    <strong>DESCRIÇÃO:</strong>
                        { recipe.descricao.split('\\n').map(desc => (
                                <p>&nbsp;&nbsp;{ desc }</p> )) }
                    <div className="display-group">
                        <div className="title">
                            <strong>CATEGORIAS:</strong>
                        </div>
                        <div className="title">
                            <strong>TIPO:</strong>
                        </div>
                    </div>

                    <div className="display-group">
                        <div className="title">
                            { recipe.categorias.length >= 1 ?
                                    recipe.categorias.map(categoria => (
                                                <p>&nbsp;&nbsp;{ categoria }</p>
                                    )) : <p>&nbsp;&nbsp;Sem categoria</p> }
                        </div>
                        <div className="title">
                            <p>&nbsp;&nbsp;{ recipe.tipo }</p>
                        </div>
                    </div>

                    <strong>INGREDIENTES:</strong>
                    { recipe.ingredientes.map(ingredient => (
                        <p>&nbsp;&nbsp;<b>{ ingredient.nome }&nbsp;</b>{ ingredient.quantidade  ? `: ${ ingredient.quantidade.replace('.00','') }` : 'a gosto' }</p>
                    ))}
                </div>
            );
        }
        return (<p> Sem receita </p>);
    }

    function ShowComments({ teste }) {

        if (!teste) {
            return(<p>Vamos comentar galera!</p>);
        } else {
            return (
                <div className="content2">
                    { teste.map(comment => (
                        <section>
                            <div>
                                <div className="display-group">
                                    <div className="main">
                                        <p><strong>Comentário de:</strong> { comment.usuario }</p>
                                    </div>
                                    <div className="second">
                                        <p><strong>NOTA:</strong> { comment.avaliacao }</p>
                                    </div>
                                </div>
                                    <p><strong>Data:</strong> { comment.data }</p>
                                    <p>{ comment.valor }</p>
                            </div>
                        <ShowSubComment sub={comment.id}/>
                        </section>
                    ))}
                </div>
            );
        }
    }

    function ShowSubComment({ sub }) {
        if (subComments) {
            const childComments = subComments.filter(obj => obj.id_pai === sub);
            if (childComments) {
                console.log(childComments);
                return (
                    <div className="identacao">
                        <ShowComments teste={childComments} />
                    </div>
                    );
            }
        }
        return (<p></p>);
    }
    
    return (
        <div className="recipe-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Detalhes da receita</h1>
                    <ShowRecipe />

                    <Link to='/' className="back-link">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Voltar para Home
                    </Link>
                </section>
            </div>    
            <ShowComments teste={ comments }/>
        </div>
    );
}
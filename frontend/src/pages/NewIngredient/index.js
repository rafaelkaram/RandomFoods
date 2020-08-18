import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import './styles.css';

import logoImg from '../../assets/random_foods.png';
import api from '../../services/api';

export default function Ingrediente() {

    const [ nome, setNome ] = useState('');
    const [ id_tipo_unidade, setTipoUnidade] = useState('');
    const [ id_tipo_ingrediente, setTipoIngrediente] = useState('');
    const [ sem_medida, setSemMedida] = useState('');
    const [ derivado_leite, setDerivadoLeite] = useState('');
    const [ gluten, setGluten] = useState('');
    const [ tipoUnidades, setTipoUnidades ] = useState([]);
    const [ tipoIngredientes, setTipoIngredientes ] = useState([]);
    
    useEffect(() => {
        api.get('tipo-unidades', ).then(response => {
            setTipoUnidades(response.data);
        });
        api.get('tipo-ingredientes', ).then(response => {
            setTipoIngredientes(response.data);
        });
    }, []);
    
    async function handleIngredient(e) {
        e.preventDefault();

        const data = {
            nome,
            id_tipo_unidade,
            id_tipo_ingrediente,
            sem_medida,
            derivado_leite,
            gluten
            

        };

        try {
            const response = await api.post('ingrediente', data);

            alert(`${ nome } cadastrado com sucesso!`);
        } catch (error) {
            alert(error.response.data.error);
        }

    }

    function changeSemMedida() {
        setSemMedida(!sem_medida);
    }

    function changeDerivadoLeite() {
        setDerivadoLeite(!derivado_leite);
    }

    function changeGluten() {
        setGluten(!gluten);
    }
    
    return (
        <div className="ingredient-container">
            <div className="content">
                <section className="form">
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <form className="combo-box" onSubmit={ handleIngredient }>
                        <h1>Cadastre Ingrediente!</h1>
                        <input
                            className="input-text"
                            placeholder="Nome"
                            value={ nome }
                            required
                            onChange={ e => setNome(e.target.value) }
                        />
                        <label>
                            <input
                                className="input-checkbox"
                                type="checkbox"
                                onChange={changeSemMedida}
                            />
                            <span>Permite não ter medida?</span>
                        </label>
                        <label>
                            <input
                                className="input-checkbox"
                                type="checkbox"
                                onChange={changeDerivadoLeite}
                            />
                            <span>Contém Lactose?</span>
                        </label>
                        <label>
                            <input
                                className="input-checkbox"
                                type="checkbox"
                                onChange={changeGluten}
                            />
                            <span>Contém Gluten?</span>
                        </label>
                        <Select
                            className="input-select"
                            options={tipoUnidades}
                            onChange={ e => setTipoUnidade(e.value) }
                        />
                        <Select
                            className="input-select"
                            options={tipoIngredientes}
                            onChange={ e => setTipoIngrediente(e.value) }
                        />
                        <button className="button" type="submit">Cadastrar</button>
                    </form>
                </section>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

import estilos from './estilos';
import { pegarRepositoriosDoUsuario } from '../../servicos/requisicoes/repositorios';
import { useIsFocused } from '@react-navigation/native';
import { buscaRepositorio } from '../../servicos/requisicoes/repositorios';

export default function Repositorios({ route, navigation }) {
    const [repo, setRepo] = useState([]);
    const estaNaTela = useIsFocused();
    const [nomeRepositorio, setNomeRepositorio] = useState();
    const [item, setItem] = useState([]);

    

    //variavel estanatela é flag pra atualizar a tela de repositorios, se sai da tela a flag muda o valor e faz a tela atualizaar
    useEffect(() => {
        async function fetchData() {
            const resultado = await pegarRepositoriosDoUsuario(route.params.id);
            setRepo(resultado);
        };
        fetchData();
    }, [estaNaTela]);

    async function busca() {
        const resultado = await buscaRepositorio(nomeRepositorio);
        console.log('resultado', resultado);
        setNomeRepositorio('');
        if (resultado) {
            setItem(resultado)
        } else {
            Alert.alert('Repositório não encontrado para o nome informado');
            setItem([]);
            setNomeRepositorio('');
        }
    }
    return (
        <View style={estilos.container}>

            <TextInput
                placeholder="Busque por um repositório"
                autoCapitalize="none"
                style={estilos.entrada}
                value={nomeRepositorio}
                onChangeText={setNomeRepositorio}
            />

            <TouchableOpacity style={estilos.botao}
                onPress={busca}
            >
                <Text style={estilos.textoBotao}>
                    Buscar
                </Text>
            </TouchableOpacity>

            {item.length === 0 ? <>

                <Text style={estilos.repositoriosTexto}>{repo.length} repositórios criados</Text>
                <TouchableOpacity
                    style={estilos.botao}
                    onPress={() => navigation.navigate('CriarRepositorio', {id: route.params.id})}
                >
                    <Text style={estilos.textoBotao}>Adicionar novo repositório</Text>
                </TouchableOpacity>
                <FlatList
                    data={repo}
                    style={{ width: '100%' }}
                    keyExtractor={repo => repo.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={estilos.repositorio}
                            onPress={() => {
                                navigation.navigate('InfoRepositorio', { item });
                                console.log('item', item);
                            }}
                        >
                            <Text style={estilos.repositorioNome}>{item.name}</Text>
                            <Text style={estilos.repositorioData}>Atualizado em {item.data}</Text>
                        </TouchableOpacity>
                    )}
                />
            </> : <>
                <Text style={estilos.repositoriosTexto}> Repositório encontrado</Text>
                <TouchableOpacity
                    style={estilos.botao}
                    onPress={() => navigation.navigate('CriarRepositorio', {id: route.params.id} )}
                >
                    <Text style={estilos.textoBotao}>Adicionar novo repositório</Text>
                </TouchableOpacity>

                {<TouchableOpacity

                    style={estilos.repositorio}
                    onPress={() => {
                        console.log('repo item', item);
                        navigation.navigate('InfoRepositorio', { item });
                    }}
                >
                    <Text style={estilos.repositorioNome}>{item.name}</Text>
                    <Text style={estilos.repositorioData}>Atualizado em {item.data}</Text>
                </TouchableOpacity>}


            </>}

        </View>
    );
}

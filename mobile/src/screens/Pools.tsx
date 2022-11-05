import { VStack, Icon, useToast, FlatList } from "native-base"
import { Header } from "../components/Header"
import { Button } from "../components/Button"
import { Loading } from "../components/Loading"
import { Fontisto } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { api } from "../services/api"
import { useCallback, useState } from "react"
import { PoolCard, PoolPros } from "../components/PoolCard"
import { EmptyPoolList } from "../components/EmptyPoolList"

export function Pools() {
    const [pools, setPools] = useState<PoolPros[]>([])
    const { navigate } = useNavigation()
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()


    const fetchPools = async () => {
        try {
            setIsLoading(true)
            const responseListPools = await api.get('/pools')
            setPools(responseListPools.data.pools)
        } catch (err) {
            console.log(err)
            toast.show({
                title: 'Não foi possivel carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)

        }
    }
    useFocusEffect(useCallback(() => {// useFocusEffect usado para recarregar lista sempre que focamos nessa tela para atualizar novos bolões
        fetchPools()
    }, []))

    return (
        <VStack flex={1} bgColor="gray.900" >
            <Header
                title='Meus bolões'
            />

            <VStack
                mt={6} mx={5}
                alignItems='center'
                borderBottomWidth={1}
                borderBottomColor='gray.600'
                pb={4}
                mb={4}
            >
                <Button
                    title="Buscar bolão por código"
                    mt={4}
                    onPress={() => navigate('find')}
                    fontSize='sm'
                    leftIcon={<Icon as={Fontisto} name='search' color='black' size='md' />}
                />
            </VStack>
            {isLoading ? <Loading /> :
                <FlatList
                    data={pools}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PoolCard
                            data={item}
                            onPress={() => navigate('details', { id: item.id })}

                        />
                    )}
                    ListEmptyComponent={() => <EmptyPoolList />}
                    showsVerticalScrollIndicator={false}
                    px={5}
                    _contentContainerStyle={{ pb: 10 }}
                />}
        </VStack>
    )
}
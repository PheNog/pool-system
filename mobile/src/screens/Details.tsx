import { HStack, useToast, VStack } from "native-base"
import { useRoute } from '@react-navigation/native'
import { Share } from "react-native"
import { Header } from "../components/Header"
import { api } from "../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import { PoolPros } from "../components/PoolCard"
import { PoolHeader } from "../components/PoolHeader"
import { EmptyMyPoolList } from "../components/EmptyMyPoolList"
import { Option } from "../components/Option"
import { Guesses } from "../components/Guesses"



interface RouteParams {
    id: string
}

export const Details = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros)
    const [optionSelected, setOptionSelected] = useState<'Seus palpites' | 'Ranking do bolão'>('Seus palpites')

    const toast = useToast()
    const route = useRoute()

    const { id } = route.params as RouteParams // usa o useRoute para puxar o id passado por parametro no arquivo de rotas

    const fetchPoolDetails = async () => {
        try {
            setIsLoading(true)
            const responseDetails = await api.get(`/pools/${id}`)
            setPoolDetails(responseDetails.data.pools)

        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possivel carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCodeShare = async () => {
        await Share.share({
            message: poolDetails.code
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) {
        return (
            <Loading />
        )
    }


    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
                title={poolDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />
            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader
                            data={poolDetails}
                        />

                        <HStack bgColor='gray.800' p={1} rounded='sm' mb={5} >
                            <Option
                                title="Seus palpites"
                                isSelected={optionSelected === 'Seus palpites'}
                                onPress={() => {
                                    setOptionSelected('Seus palpites')
                                }}
                            />

                            <Option
                                title="Ranking do bolão"
                                isSelected={optionSelected === 'Ranking do bolão'}
                                onPress={() => {
                                    setOptionSelected('Ranking do bolão')
                                }}
                            />
                        </HStack>

                        <Guesses 
                        poolId={poolDetails.id}
                        />
                    </VStack>
                    : <EmptyMyPoolList onShare={handleCodeShare} code={poolDetails.code} />
            }

        </VStack>
    )
}
import { Heading, useToast, VStack } from "native-base"
import { Header } from "../components/Header"
import Logo from "../assets/logo.svg"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useState } from "react"
import { api } from "../services/api"
import { useNavigation } from "@react-navigation/native"

export function Find() {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')

    const toast = useToast()
    const { navigate } = useNavigation()

    const handleJoinPool = async () => {
        try {
            setIsLoading(true)

            if(!code.trim()) {
                toast.show({
                    title: 'Informe o código do bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            await api.post('/pools/join', { code })
            
            toast.show({
                title: 'Você entrou no bolão com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })
            
            navigate('pools')


        } catch(error) {
            console.log(error)
            setIsLoading(false)

            if (error.response?.data?.message === 'Bolão não encontrado.') {
                toast.show({
                    title: 'Não foi possivel encontrar o bolão.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if (error.response?.data?.message === 'Você ja está nesse bolão!') {
                toast.show({
                    title: 'Você ja está nesse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
        } 
    }

    return (
        <VStack flex={1} bgColor="gray.900"  >
            <Header
                title='Buscar por código'
                showBackButton
            />

            <VStack mt={8} mx={5} alignItems='center' >
                <Logo />

                <Heading
                    fontFamily='heading'
                    color='white'
                    fontSize='xl'
                    my={8}
                    textAlign='center'
                >
                    Encontre um bolão através de {'\n'} 
                    seu código único.
                </Heading>
                <Input
                    placeholder="Qual código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />
                <Button
                    title="Buscar bolão"
                    mt={2}
                    fontSize='sm'
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />
            </VStack>
        </VStack>
    )
}
import { Heading, VStack, Text, useToast, Toast } from "native-base"
import { Header } from "../components/Header"
import Logo from "../assets/logo.svg"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useState } from "react"
import { api } from "../services/api"

export function New() {

    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const toast = useToast()
    const handlePoolCreate = async () => {
        if (!title.trim()) {
            return toast.show({
                title: 'Você precisa informar um título para o seu bolão!',
                placement: "top",
                bgColor: 'yellow.500',
                color: 'black'
            })
        }

        try {
            setIsLoading(true)

            await api.post('/pools', {
                //title // quando a propriedade e a variavel forem iguais, pode-se apenas colocar ela subtituindo 'title: title'
                title: title.toUpperCase() // aqui não usei a opção acima mencionada para poder usar o toUpperCase
            })

            toast.show({
                title: 'Bolão criado com sucesso!',
                placement: "top",
                bgColor: 'green.500'
            })

            setTitle('')
        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possivel criar um bolão',
                placement: "top",
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900"  >
            <Header
                title='Criar novo bolão'
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
                    Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
                </Heading>
                <Input
                    placeholder="Qual nome do seu bolão?"
                    onChangeText={setTitle}
                    value={title}
                />
                <Button
                    title="Criar meu bolão"
                    mt={2}
                    fontSize='sm'
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />
                <Text color="white" textAlign='center' mt={4} fontSize='sm'  >
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}
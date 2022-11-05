import { Button as ButtonNativeBase, Text, IButtonProps }  from 'native-base'

interface Props extends IButtonProps{
    title: string;
    type?: 'PRIMARY' | 'SECONDARY'
}

export const Button = ( { title, type = 'PRIMARY', ...rest }: Props) => {
    return (
         /*...rest puxa todas propriedades restantes do botao/componente e tem que ser a ultima proriedade declarada */
        <ButtonNativeBase 
            w="full"
            h={14}
            rounded="sm"
            fontSize="md"
            bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
            _pressed={{
                bg: type === 'SECONDARY' ? 'red.400' : 'yellow.600'
            }}
            _loading={{
                _spinner: { color: 'black' }
            }}
            {...rest} 
        >
            <Text
            fontSize="sm"
            fontFamily="heading"
            textTransform="uppercase"
            color={ type === 'SECONDARY' ? 'white' : 'black' }
            >
                {title}
            </Text>
        </ButtonNativeBase>
    )
}
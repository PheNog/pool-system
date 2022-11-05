import { Box } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { useAuth } from '../hooks/useAuth'
import { SignIn } from '../screens/SignIn'
import { AppRoutes } from './app.routes'

export const Routes = () => {
    const { user } = useAuth()
    return (
        <Box flex={1} bg="gray.900" >
            <NavigationContainer>
                {user.name ? <AppRoutes /> : <SignIn />}
            </NavigationContainer>
        </Box>

    )
}
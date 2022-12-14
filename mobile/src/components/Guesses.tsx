import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game'
import { Loading } from './Loading';


interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])
  const toast = useToast()

  const fetchGames = async () => {
    try {
      setIsLoading(true)

      const responseGameFetch = await api.get(`/pools/${poolId}/games`)
      setGames(responseGameFetch.data.games)

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }

  }

  const handleGuessConfirm = async (gameId: string) => {
    try {
      setIsLoading(true)
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'yellow.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Palpite enviado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possivel registrar seu palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if(isLoading) {
    return <Loading />
  }

  return (

    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => {
            handleGuessConfirm(item.id)
          }}
        />
      )}
      _contentContainerStyle={{pb: 10}}
    />




  );
}

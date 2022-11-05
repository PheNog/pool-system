import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/iconCheck.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')


  const createPool = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const responseCreatePool = await api.post('/pools', {
        title: poolTitle
      })
      const { code } = responseCreatePool.data

      navigator.clipboard.writeText(code)

      alert('O bolão foi criado com sucesso, o código foi copiado para a area de transferencia!')
      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('falha ao criar o bolão, tente novamente!')
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center ">
      <main className='py-4'>
        <Image
          src={logoImg}
          alt="NLW COPA"
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image
            src={usersAvatarExampleImg}
            alt="NLW users example"
          />

          <strong className='text-gray-100 text-xl' >
            <span className="text-ignite-500" >+{props.userCount}</span> pessoas ja estão usando!
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex' >
          <input
            className='
          flex-1 
          px-6 
          py-4 
          rounded
          bg-gray-800 
          border border-gray-600 
          text-sm
          text-gray-100
          '
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className='
          bg-yellow-500 
          px-6 
          py-4 
          rounded
          text-gray-900
          font-bold
          text-sm
          uppercase
          hover:bg-yellow-700
          ' type="submit">Criar meu bolão</button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed '>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100' >
          <div className='flex items-center gap-6'>
            <Image
              src={iconCheckImg}
              alt="icon check"
            />
            <div className='flex flex-col' >
              <span className='font-bold text-2xl' >+{props.poolCount}</span>
              <span className='text-sm'>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600'>

          </div>
          <div className='flex items-center gap-6'>
            <Image
              src={iconCheckImg}
              alt="icon check"
            />
            <div className='flex flex-col justify-around'>
              <span className='font-bold text-2xl' >+{props.guessCount}</span>
              <span className='text-sm'>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo previa do app do bolão da copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {

  const [
    poolCountResponse,
    guessCountResponse,
    userCountResponse,
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}

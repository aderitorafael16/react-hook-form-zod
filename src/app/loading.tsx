import Image from 'next/image'
import loading from '../assets/loading.gif'

export default function Loading() {
  return (
    <div className="flex items-center justify-center ">
      <Image src={loading} alt="Carregando a página"/>
    </div>
  )
}